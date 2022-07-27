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
            ipSitePair: {},
            ipAddresses: [], // List of IP addresses.
            siteIds: [], // List of siteIds.
            names: [] // List of modal names.
        }
    },
    // Method Functions
    methods: {

    }, 

    async mounted() {
        await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/sites/fetch`)
            .then(response => response.json())
            .then((jsonResponse) => {
                for (var i in jsonResponse) {
                    this.ipSitePair[jsonResponse[i].current.siteId] =  jsonResponse[i].current.ip;
                    this.siteIds.push(jsonResponse[i].current.siteId);
                    this.names.push(jsonResponse[i].current.ip.replace(/\./g, ''));
                }
                this.siteIds.sort();
                console.log(this.ipSitePair);
                console.log(this.siteIds);
                for (var j in this.siteIds) {
                    console.log(this.ipSitePair[this.siteIds[j]]);
                    this.ipAddresses.push(this.ipSitePair[this.siteIds[j]]);
                }
                console.log(this.ipAddresses);
            });
    }
}
</script>


