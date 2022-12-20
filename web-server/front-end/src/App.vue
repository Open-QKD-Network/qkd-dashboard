<script setup>
import NetworkMap from "./components/NetworkMap.vue";
</script>
<template>
  <nav class="font-medium">
    <div class="pt-4 px-4 text-3xl">OpenQKDDashboard</div>
    <el-divider />
  </nav>
  <el-main>
    <el-card>
      <NetworkMap />
    </el-card>
  </el-main>
</template>
