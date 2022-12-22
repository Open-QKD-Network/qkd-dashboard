<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import * as vis from "vis-network";
import { useGlobalStore } from "@/stores/global";

const globalStore = useGlobalStore();
const { connectionInfo, topologies } = storeToRefs(globalStore);

const networkOptions = {
  layout: { clusterThreshold: 400 },
  physics: {
    stabilization: false,
    barnesHut: {
      springLength: 500,
      springConstant: 0,
    },
  },
  nodes: {
    shape: "dot",
    size: 25,
    font: {
      size: 15,
      color: "#fbfbfe",
    },
    borderWidth: 1,
  },
  edges: {
    width: 3,
    color: {
      inherit: false,
    },
    smooth: false,
  },
};

const graph = () => {
  let idCount = 0;
  const siteToId = {};
  const createNode = (site) => {
    if (!siteToId[site.siteId]) {
      siteToId[site.siteId] = idCount;
      idCount++;
    }
    const id = siteToId[site.siteId];
    return {
      id,
      label: `${site.siteId} - ${site.ip}`,
      color: "#73C2BE",
    };
  };

  const createLink = (fromSite, toSite, color) => {
    const fromId = siteToId[fromSite.siteId];
    const toId = siteToId[toSite.siteId];
    return {
      name: `Link from ${fromSite.siteId} to ${toSite.siteId}`,
      color: color,
      from: fromId,
      to: toId,
    };
  };
  const nodes = [];
  const links = [];
  const linksMade = {};
  const knownSites = topologies.value.reduce((acc, topology) => {
    acc[topology.current.siteId] = true;
    return acc;
  }, {});
  for (const topology of topologies.value) {
    nodes.push(createNode(topology.current));
  }
  for (const topology of topologies.value) {
    const fromSite = topology.current;
    for (const toSite of topology.neighbours) {
      if (!knownSites[toSite.siteId]) {
        continue;
      }
      if (!linksMade[`${toSite.siteId}-${fromSite.siteId}`]) {
        let color = "#FF3366";
        if (
          connectionInfo.value[fromSite.siteId] != undefined &&
          connectionInfo.value[fromSite.siteId][toSite.siteId] != undefined
        ) {
          color = "#5FAD41";
        }
        links.push(createLink(fromSite, toSite, color));
        linksMade[`${fromSite.siteId}-${toSite.siteId}`] = true;
      }
    }
  }
  const container = document.getElementById("topology-canvas");
  new vis.Network(container, { nodes, edges: links }, networkOptions);
};

onMounted(() => {
  graph();
  globalStore.registerCallback({
    name: "topology-graph",
    callback: graph,
  });
});
</script>

<template>
  <div id="topology-canvas" />
</template>

<style>
#topology-canvas {
  height: 400px;
}
</style>
