<script setup>
import { reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useConnectionInfoStore } from "@/stores/connectionInfo";
import Plotly from "plotly.js-dist";

// Results in amgbiguous import error so for now this is hardcoded
const WebsocketCalls = {
  keyInfo: "0",
  keyRate: "1",
  ipCount: "2",
  connectionStatus: "3",
};

const PUBLIC_IP = import.meta.env.VITE_PUBLIC_IP;
const url = `http://${PUBLIC_IP}:8001/api/v1`;
const wsUrl = `ws://${PUBLIC_IP}:8002`;

const state = reactive({
  locations: {},
  topologies: [],
});
const connectionInfoStore = useConnectionInfoStore();
const { connectionInfo } = storeToRefs(connectionInfoStore);

const layout = {
  showlegend: false,
  margin: { r: 0, t: 0, b: 0, l: 0 },
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  geo: {
    bgcolor: "rgba(0,0,0,0)",
    resolution: 50,
    showland: true,
    showlakes: true,
    showcountries: true,
    landcolor: "rgba(0,0,0,0)",
    lakecolor: "#42404F",
    projection: {
      type: "equirectangular",
    },
    coastlinewidth: 1,
  },
};

const createNodeMap = async () => {
  const nodesIpInfo = {};
  for (const topology of state.topologies) {
    const ipInfoResponse = await fetch(
      `${url}/ipInfo/fetch/ip/${topology.current.ip}`
    );
    nodesIpInfo[topology.current.ip] = await ipInfoResponse.json();
  }
  const nodesData = state.topologies.flatMap((topology) => {
    const ipInfo = nodesIpInfo[topology.current.ip];
    const location = state.locations[ipInfo.locationId];

    const data = [];

    data.push({
      type: "scattergeo",
      lat: [parseFloat(location.latitude)],
      lon: [parseFloat(location.longitude)],
      mode: "markers",
      hoverinfo: "name",
      name: location.city,
      marker: {
        color: "#FFFFFF",
      },
    });

    for (const neighbour of topology.neighbours) {
      const neighbourIpInfo = nodesIpInfo?.[neighbour.ip];
      if (neighbourIpInfo) {
        const neighbourLocation = state.locations[neighbourIpInfo.locationId];
        const connection = {
          type: "scattergeo",
          lat: [
            parseFloat(neighbourLocation.latitude),
            parseFloat(location.latitude),
          ],
          lon: [
            parseFloat(neighbourLocation.longitude),
            parseFloat(location.longitude),
          ],
          mode: "lines",
          hoverinfo: "skip",
          line: {
            width: 2,
            color: "#FF3366",
          },
          marker: {
            colorbar: {
              bordercolor: "black",
            },
          },
        };

        if (
          connectionInfo.value[topology.current.siteId] != undefined &&
          connectionInfo.value[topology.current.siteId][neighbour.siteId] !=
            undefined
        ) {
          connection.line.color = "#5FAD41";
        }
        data.push(connection);
      }
    }

    return data;
  });

  Plotly.newPlot("network-map", nodesData, layout, { responsive: true });
};

onMounted(async () => {
  const locationResponse = await fetch(`${url}/location/fetch`);
  const locationsArray = await locationResponse.json();
  for (const location of locationsArray) {
    state.locations[location._id] = location;
  }
  const topologiesResponse = await fetch(`${url}/sites/fetch`);
  state.topologies = await topologiesResponse.json();
  createNodeMap();

  connectionInfoStore.registerCallback(createNodeMap);
});
</script>
<template>
  <div id="network-map" />
</template>
