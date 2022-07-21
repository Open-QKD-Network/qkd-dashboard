<template>
    <!-- Modal -->
    <div v-for="(ip, index) in ipAddresses" :key="ip" class="modal fade" :id="'ip' + names[index]" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"> {{ipAddresses[index]}}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'SiteModal',
    /**
     * Returns Variables.
     */
    data(){
        return {
            ipAddresses: [], // List of IP addresses.
            names: [] // List of sitIds.
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
                    this.names.push(jsonResponse[i].ip.replace(/./g, ''));
                }
            });
        
        try {
            var ws = new WebSocket("ws://localhost:8002");
            ws.onmessage = (message) => {
                console.log(message);
            }

        } catch (e) {
            console.log("ERROR ON WS CONNECTION.")
        }
    }
}
</script>


