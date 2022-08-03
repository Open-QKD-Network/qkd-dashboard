<template>
    <!-- Modal -->
    <div v-for="(ip, index) in ipAddresses" :key="ip" class="modal fade" :id="'ip' + names[index]" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"> {{  ipAddresses[index]  }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <table class="table text-center" style="overflow-y: auto;">
                    <thead>
                        <tr>
                            <th scope="col">Site</th>
                            <th scope="col">Key Count</th>
                            <th scope="col">Key Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(rates, index2) in keyInformation[ip].keyRates" :key="rates">
                            <td>{{  rates.neigbourId  }}</td>
                            <td>{{  keyInformation[ip].keyCounts[index2].count  }}</td>
                            <td>{{  rates.rate  }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import Constants from "../../config.js";
import WebSocketConstants from "../../../../../constants/websocketCalls";

export default {
    name: 'SiteModal',
    /**
     * Returns Variables.
     */
    data(){
        return {
            ipAddresses: [], // List of IP addresses.
            names: [], // List of IP addresses without the '.'.
            keyInformation: {} // Updated key information.
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
        
            var ws = new WebSocket(`ws://${Constants.PUBLIC_IP}:8002`);
            ws.onopen = () => {
                ws.send(WebSocketConstants.WebsocketCalls.keyInfo);
            }
            ws.onmessage = (message) => {
                var data = JSON.parse(message.data);
                for (var i in data) {
                    if (data[i].KeyInfo != undefined) {
                        this.keyInformation[i] = data[i].KeyInfo;
                    }
                }
                
            }

            ws.onerror = (err) => {
                console.log("ERROR ON WS CONNECTION: " + err);

            }

    }
}
</script>


