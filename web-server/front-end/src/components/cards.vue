<template>
  <div class="card mb-3">
    <div class="card-header text-bg-primary">
      {{ title }}
    </div>
    <div class="card-body">
      <div>
        <!-- Type of tab to add-->
        <div v-if="tab == 'topology'"><TopologyClass /></div>
        <div v-if="tab == 'network-map'"><NetworkMap /></div>
      </div>
    </div>
  </div>
</template>

<script>
import TopologyClass from './card-elements/topology.vue'
import NetworkMap from './card-elements/networkMap.vue'

export default {
  name: 'CardClass',
  /**
   * Dependancy variables (variables you need to provide).
   */
  props: {
    title: String,
    tab: String
   },
   /**
    * Used Components.
    */
   components: {
    TopologyClass,
    NetworkMap
   }
}
</script>


