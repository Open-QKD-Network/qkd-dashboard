<template>
  <div class="card mb-3">
    <div class="card-header text-bg-primary">
      {{ title }}
    </div>
    <div class="card-body">
      <div>
        <!-- Type of tab to add-->
        <div v-if="tab == 'topology'"><TopologyClass /></div>
        <!-- <h1 v-if="tab == 'network-map'">MAP</h1> -->
      </div>
    </div>
  </div>
</template>

<script>
import TopologyClass from './card-elements/topology.vue'

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
    TopologyClass
   }
}
</script>


