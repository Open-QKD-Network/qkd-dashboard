<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import Plotly from "plotly.js-dist";
import { useGlobalStore } from "@/stores/global";

const PUBLIC_IP = import.meta.env.VITE_PUBLIC_IP;
const url = `http://${PUBLIC_IP}:8001/api/v1`;

const globalStore = useGlobalStore();
const { connectionInfo, locations, topologies } = storeToRefs(globalStore);

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

async function createNodeMap() {
  const nodesIpInfo = {};
  for (const topology of topologies.value) {
    const ipInfoResponse = await fetch(
      `${url}/ipInfo/fetch/ip/${topology.current.ip}`
    );
    nodesIpInfo[topology.current.ip] = await ipInfoResponse.json();
  }
  const nodesData = topologies.value.flatMap((topology) => {
    const ipInfo = nodesIpInfo[topology.current.ip];
    const location = locations.value[ipInfo.locationId];

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
        const neighbourLocation = locations.value[neighbourIpInfo.locationId];
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
}

onMounted(() => {
  createNodeMap();

  globalStore.registerCallback({
    name: "createNodeMap",
    callback: createNodeMap,
  });
});
</script>
<template>
  <div id="network-map" />
</template>
