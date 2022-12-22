import { ref } from "vue";
import { defineStore } from "pinia";

export const useConnectionInfoStore = defineStore("connectionInfo", () => {
  const connectionInfo = ref({});
  const callbacks = ref([]);

  function update(newInfo) {
    connectionInfo.value = newInfo;
  }

  function runCallbacks() {
    for (const callback of callbacks.value) {
      callback();
    }
  }

  function registerCallback(callback) {
    callbacks.value.push(callback);
  }

  return {
    connectionInfo,
    callbacks,
    update,
    runCallbacks,
    registerCallback,
  };
});
