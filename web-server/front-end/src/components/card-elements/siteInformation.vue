<template>
    <div class="container" style="">
        <div class="list-group" style="overflow: scroll; max-height: 300px;" >
            <button v-for="ip in ipAddresses" :key="ip" class="list-group-item">{{ip}}</button>
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
        await fetch("http://localhost:5000/api/v1/ipInfo/fetch")
            .then(response => response.json())
            .then((jsonResponse) => {
                for (var i in jsonResponse) {
                    this.ipAddresses.push(jsonResponse[i].ip);
                }
            });
    }
}
</script>


