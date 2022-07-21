<template>
    <div class="container">
        <div class="list-group" style="overflow-y: auto; height: 400px;" >
            <button v-for="ip in ipAddresses" :key="ip" class="list-group-item">{{ ip }}</button>
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
            ipAddresses: [] // List of topology JSON objects.
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
                }
            });
    }
}
</script>


