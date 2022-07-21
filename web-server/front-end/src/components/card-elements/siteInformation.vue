<template>
    <div class="container">
        <div class="list-group" style="overflow-y: auto; height: 400px;" >
            <button data-bs-toggle="modal" data-bs-target="#t" class="list-group-item">tst</button>
            <button v-for="(ip, index) in ipAddresses" :key="ip" class="list-group-item" data-bs-toggle="modal" :data-bs-target="names[index]">{{ ip }}</button>
        </div>
    </div>
</template>

<script>
 

export default {
    name: 'SiteInformationClass',
    /**
     * Returns Variables.
     */
    data(){
        return {
            ipAddresses: [], // List of IP addresses.
            siteIds: [] // List of sitIds.
        }
    },
    // Method Functions
    methods: {

    }, 

    async mounted() {
        await fetch("http://localhost:8001/api/v1/ipInfo/fetch")
            .then(response => response.json())
            .then((jsonResponse) => {
                for (var i in jsonResponse) {
                    this.ipAddresses.push(jsonResponse[i].ip);
                    this.ipAddresses.push(jsonResponse[i].siteId);
                }
            });
    }
}
</script>


