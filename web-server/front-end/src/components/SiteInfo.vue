<script setup>
import { reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import zipWith from "lodash-es/zipWith";
import merge from "lodash-es/merge";
import { useGlobalStore } from "@/stores/global";

const state = reactive({
  data: [],
});
const globalStore = useGlobalStore();
const { siteInfo, topologies } = storeToRefs(globalStore);

const getData = () => {
  const knownSites = topologies.value.reduce((acc, topology) => {
    acc[topology.current.siteId] = true;
    return acc;
  }, {});
  merge(
    state.data,
    topologies.value.map((topology) => {
      const fullKeyInfo = siteInfo.value?.[topology.current.ip]?.KeyInfo;
      const keyInfo = zipWith(
        fullKeyInfo?.keyCounts || [],
        fullKeyInfo?.keyRates || [],
        (keyCount, keyRate) => ({
          siteId: keyCount.neighbourId,
          count: keyCount.count,
          rate: keyRate.rate,
        })
      ).filter((site) => knownSites[site.siteId]);
      return {
        siteId: topology.current.siteId,
        ip: topology.current.ip,
        city: topology.current.location.city,
        keyInfo,
      };
    })
  );
};

onMounted(() => {
  getData();
  globalStore.registerCallback({ name: "siteInfoData", callback: getData });
});
</script>

<template>
  <el-table :data="state.data" style="width: 100%" height="400" border>
    <el-table-column type="expand">
      <template #header>
        <div class="pt-1">
          <span class="material-symbols-outlined">info</span>
        </div>
      </template>
      <template #default="props">
        <div class="p-4">
          <h2 class="text-xl mb-2 -mt-2">Connections</h2>
          <el-table :data="props.row.keyInfo" border>
            <el-table-column prop="siteId" label="Site" width="52" />
            <el-table-column prop="count" label="Key Count" />
            <el-table-column prop="rate" label="Key Rate" />
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="siteId" label="Site" width="52" />
    <el-table-column prop="ip" label="IP Address" />
    <el-table-column prop="city" label="City" />
  </el-table>
</template>
