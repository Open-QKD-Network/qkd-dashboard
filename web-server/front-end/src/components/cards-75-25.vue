<template>
    <div class="container"> 
        <div class="row mw-100">
            <div class="col-9"> 
                <div class="card mb-3">
                    <div class="card-header text-bg-primary">
                    {{ title1 }}
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <!-- Type of tab to add-->
                            <!--75% Tabs-->
                            <div v-if="tab1 == 'topology'"><TopologyClass /></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-3"> 
                <div class="card mb-3">
                    <div class="card-header text-bg-primary">
                    {{ title2 }}
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <!-- Type of tab to add-->
                            <!--25% Tabs-->
                            <div v-if="tab2 == 'sites'"><SiteInformationClass /></div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TopologyClass from './card-elements/topology.vue'
import SiteInformationClass from './card-elements/siteInformation.vue'

export default {
  name: 'Cards75_25',
  /**
   * Dependancy variables (variables you need to provide).
   */
  props: {
    title1: String,
    title2: String,
    tab1: String,
    tab2: String
   },
   /**
    * Used Components.
    */
   components: {
    SiteInformationClass,
    TopologyClass
   }
}
</script>


