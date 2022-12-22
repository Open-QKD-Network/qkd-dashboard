import { ref } from "vue";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", () => {
  const connectionInfo = ref({});
  const locations = ref({});
  const topologies = ref([]);
  const callbacks = ref([]);

  function runCallbacks() {
    for (const callback of callbacks.value) {
      callback.callback();
    }
  }

  function registerCallback(callback) {
    for (const callback of callbacks.value) {
      if (callback.name == "name") {
        return;
      }
    }
    callbacks.value.push(callback);
  }

  return {
    connectionInfo,
    locations,
    topologies,
    callbacks,
    runCallbacks,
    registerCallback,
  };
});
