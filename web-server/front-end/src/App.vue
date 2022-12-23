<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import merge from "lodash-es/merge";
import NetworkMap from "@/components/NetworkMap.vue";
import NetworkTopology from "@/components/NetworkTopology.vue";
import SiteInfo from "@/components/SiteInfo.vue";
import { useGlobalStore } from "@/stores/global";

// Results in amgbiguous import error so for now this is hardcoded
const WebSocketCalls = {
  keyInfo: "0",
  keyRate: "1",
  ipCount: "2",
  connectionStatus: "3",
};

const globalStore = useGlobalStore();
const { connectionInfo, siteInfo, locations, topologies } =
  storeToRefs(globalStore);

const PUBLIC_IP = import.meta.env.VITE_PUBLIC_IP;
const WS_PORT = import.meta.env.VITE_SERVER_WS_PORT;
const serverURL = `http://${PUBLIC_IP}:8001/api/v1`;
const wsURL = `ws://${PUBLIC_IP}:${WS_PORT}`;

onMounted(async () => {
  const locationResponse = await fetch(`${serverURL}/location/fetch`);
  const locationsArray = await locationResponse.json();
  for (const location of locationsArray) {
    locations.value[location._id] = location;
  }

  const topologiesResponse = await fetch(`${serverURL}/sites/fetch`);
  topologies.value = await topologiesResponse.json();

  const ipInfoResponse = await fetch(`${serverURL}/ipInfo/fetch`);
  const ipInfo = await ipInfoResponse.json();
  const ipInfoMap = ipInfo.reduce((acc, info) => {
    acc[info.ip] = info;
    return acc;
  }, {});
  topologies.value.forEach((topology) => {
    const locationId = ipInfoMap[topology.current.ip].locationId;
    topology.current.location = locations.value[locationId];
  });

  globalStore.registerCallback({
    name: "debug",
    callback: () => console.debug("Callbacks have been called."),
  });

  const ws = new WebSocket(wsURL);

  ws.onopen = () => {
    ws.send(WebSocketCalls.connectionStatus);
  };

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    siteInfo.value = merge(siteInfo.value, data);
    for (const ip in data) {
      if (data[ip].ConnectionInfo !== undefined) {
        connectionInfo.value = data[ip].ConnectionInfo;
      }
    }
    globalStore.runCallbacks();
  };
});
</script>
<template>
  <nav class="font-medium">
    <div class="pt-4 px-4 text-3xl">Open QKD Dashboard</div>
    <el-divider />
  </nav>
  <el-main>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <NetworkTopology />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <SiteInfo />
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card>
          <NetworkMap />
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<style>
.el-row {
  margin-bottom: 20px;
}
</style>
