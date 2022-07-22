<template>
    <div class="container">
        <div class="list-group" style="overflow-y: auto; height: 400px;" >
            <button v-for="(ip, index) in ipAddresses" :key="ip" class="list-group-item" data-bs-toggle="modal" :data-bs-target="'#ip' + names[index]">{{ ip }}</button>
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
            ipAddresses: [], // List of IP addresses.
            names: [] // List of modal names.
        }
    },
    // Method Functions
    methods: {

    }, 

    async mounted() {
        await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/ipInfo/fetch`)
            .then(response => response.json())
            .then((jsonResponse) => {
                for (var i in jsonResponse) {
                    this.ipAddresses.push(jsonResponse[i].ip);
                    this.names.push(jsonResponse[i].ip.replace(/\./g, ''));
                }
            });
    }
}
</script>


