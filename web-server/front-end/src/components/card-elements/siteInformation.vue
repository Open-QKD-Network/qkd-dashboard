<template>
    <div class="container">
        <div class="list-group" style="overflow-y: auto; height: 400px;" >
            <button v-for="(ip, index) in ipAddresses" :key="ip" class="list-group-item" data-bs-toggle="modal" :data-bs-target="'#ip' + names[index]">{{ siteIds[index] + ': ' + ip }}</button>
        </div>
    </div>
</template>

<script>
import Constants from "../../config.js";


export default {
    name: 'SiteInformationClass',
    /**
     * Returns Variables.
     */
    data(){
        return {
            ipSitePair: {}, // Dictionary of SiteIDs (keys) and IPs (values).
            ipAddresses: [], // List of IP addresses.
            siteIds: [], // List of siteIds.
            names: [] // List of modal names.
        }
    },
    // Method Functions
    methods: {

    }, 
    /**
     * Mounted class once webpage is up. Fetches sites from backend.
     */
    async mounted() {
        await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/sites/fetch`)
            .then(response => response.json())
            .then((jsonResponse) => {
                for (var i in jsonResponse) {
                    this.ipSitePair[jsonResponse[i].current.siteId] =  jsonResponse[i].current.ip;
                    this.siteIds.push(jsonResponse[i].current.siteId);
                }
                this.siteIds.sort();

                for (var j in this.siteIds) {
                    this.ipAddresses.push(this.ipSitePair[this.siteIds[j]]);
                    this.names.push(this.ipAddresses[j].replace(/\./g, ''));

                }
            });
    }
}
</script>


