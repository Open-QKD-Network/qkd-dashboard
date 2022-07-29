<template>
    <div  class="container">
        <div class="row align-items-center" id="topologyDiv">
            <div class="d-flex justify-content-center" id="topologyCanvas"></div>
        </div>
    </div>
</template>

<script>
import fetch from 'node-fetch';
import Constants from "../../config.js";
import WebSocketConstants from "../../../../../constants/websocketCalls";


export default {
    name: 'TopologyClass',
    /**
     * Returns Variables.
     */
    data(){
        return {
            ipTotal:0, // Total Number of available IPs.
            ipLength:0, // Number current IPs accesed.
            topologies: [], // List of topology JSON objects.
            ConnectionInfo: {}, // Information regarding the connections.


            Dracula: undefined,
            Graph : undefined,
            Renderer: undefined,
            Layout: undefined,

            graphModel: undefined,
            layout: undefined,
            renderer: undefined

        }
    },
    // Method Functions
    methods: {
        /**
         * Creates node graph by looping though @topologies and adding an edge bwtween each IP and its neighbour.
         */
        graph() {
            const successStyle = {
                stroke: '#00ff00',
                fill: '#00ff00',
            };

            const failedStyle = {
                stroke: '#ff0000',
                fill: '#ff0000',
            };

            var width = document.getElementById("topologyDiv").clientWidth - 20;

            this.Dracula = require('graphdracula');
            this.Graph = this.Dracula.Graph;
            this.Renderer = this.Dracula.Renderer.Raphael;
            this.Layout = this.Dracula.Layout.Spring;
            
            this.graphModel = new this.Graph();
            
            for (var i in this.topologies) {
                var currentSiteId = this.topologies[i]["current"]["siteId"];
                var currentIp = this.topologies[i]["current"]["ip"];
                
                var neighbours = this.topologies[i]["neighbours"]
                for (var j in neighbours) {
                    var neigbourSiteId = neighbours[j]["siteId"];
                    var neigbourIp = neighbours[j]["ip"];
                    //console.log(`${this.ConnectionInfo[currentSiteId][neigbourSiteId]} : ${currentSiteId} : ${neigbourSiteId}`)
                    if (this.ConnectionInfo[currentSiteId] != undefined && this.ConnectionInfo[currentSiteId][neigbourSiteId] != undefined){
                        this.graphModel.addEdge(`${currentSiteId} - ${currentIp}`, `${neigbourSiteId} - ${neigbourIp}`, {style: successStyle});
                    } else {
                        this.graphModel.addEdge(`${currentSiteId} - ${currentIp}`, `${neigbourSiteId} - ${neigbourIp}`, {style: failedStyle});
                    }
                }
            }
            
            this.layout = new this.Layout(this.graphModel);
            this.layout.layout();
            this.renderer = new this.Renderer('#topologyCanvas', this.graphModel, width, 400);
            this.renderer.draw();
        },


        regraph() {
            // this.layout.layout();
            // this.renderer.draw();
        }
    }, 
    /**
     * Mounted class once webpage is up. Fetches locations and sites from backend.
     */
    async mounted() {
        await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/sites/fetch`)
            .then(response => response.json())
            .then((jsonResponse) => {
                this.topologies = jsonResponse;
                this.graph();
            });
        var ws = new WebSocket(`ws://${Constants.PUBLIC_IP}:8002`);
        ws.onopen = () => {
            ws.send(WebSocketConstants.WebsocketCalls.connectionStatus);
        }

        ws.onmessage = (message) => {
            var data = JSON.parse(message.data);
            for (var i in data) {
                if (data[i].ConnectionInfo != undefined) {
                    if (this.ConnectionInfo != data[i].ConnectionInfo) {
                        this.ConnectionInfo = data[i].ConnectionInfo;
                        this.regraph();
                    }
                    
                }
            }
            
        }

        ws.onerror = (err) => {
            console.log("ERROR ON WS CONNECTION: " + err);

        }
    }
}
</script>

