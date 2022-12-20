<script setup>
import { ref, onMounted } from "vue";
/* import Plotly from "plotly.js-dist"; */
/* import * as _ from "lodash-es"; */
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

const locations = ref([]);
const topologies = ref([]);

onMounted(async () => {
  const locationResponse = await fetch(`${url}/location/fetch`);
  locations.value = await locationResponse.json();
  const topologiesResponse = await fetch(`${url}/sites/fetch`);
  topologies.value = await topologiesResponse.json();
  // createNodeMap()

  const ws = new WebSocket(wsUrl);
  ws.onopen = () => {
    ws.send(WebsocketCalls.connectionStatus);
  };

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log(data);
  };
});
</script>
<template>
  <div id="network-map" />
</template>
