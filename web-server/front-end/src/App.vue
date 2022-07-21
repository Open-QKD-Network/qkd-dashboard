<template>
  <Cards75_25 title="QKD Network Topology" tab1="topology" tab2="sites"/>
  <!-- <CardClass title="QKD Network Map" tab="network-map"/> -->
</template>

<script>
// import CardClass from './components/cards.vue'
import Cards75_25 from './components/cards-75-25.vue'

/**
 * MAIN APP.
 */
export default {
  name: 'App',
  /**
   * Used Components
   */
  components: {
    Cards75_25
  }
}
</script>

