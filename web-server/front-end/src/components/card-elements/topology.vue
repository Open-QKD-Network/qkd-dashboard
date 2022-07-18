<template>
    <div  class="container">
        <div class="row align-items-center">
            <div class="d-flex justify-content-center" id="topologyCanvas"></div>
        </div>
    </div>
</template>

<script>
import {WebsocketCalls} from '../../../../../constants/websocketCalls'


export default {
    name: 'TopologyClass',
    /**
     * Returns Variables.
     */
    data(){
        return {
            ipTotal:0, // Total Number of available IPs.
            ipLength:0, // Number current IPs accesed.
            topologies: [] // List of topology JSON objects.
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

            // const failedStyle = {
            //     stroke: '#ff0000',
            //     fill: '#ff0000',
            // };

            var Dracula = require('graphdracula');
            var Graph = Dracula.Graph;
            var Renderer = Dracula.Renderer.Raphael;
            var Layout = Dracula.Layout.Spring;
            
            var graph = new Graph();
            
            for (var i in this.topologies) {
                var currentSiteId = this.topologies[i]["current"]["siteId"];
                var currentIp = this.topologies[i]["current"]["ip"];
                
                console.log(`${currentSiteId} - ${currentIp}`);
                var neighbours = this.topologies[i]["neighbours"]
                for (var j in neighbours) {
                    var neigbourSiteId = neighbours[j]["siteId"];
                    var neigbourIp = neighbours[j]["ip"];
                    console.log(`${neigbourSiteId} - ${neigbourIp}`);
                    graph.addEdge(`${currentSiteId} - ${currentIp}`, `${neigbourSiteId} - ${neigbourIp}`, {style: successStyle});
                }
            }
            
            var layout = new Layout(graph);
            layout.layout();
            var renderer = new Renderer('#topologyCanvas', graph, 1000, 400);
            renderer.draw();
        }
    }, 

    mounted() {
        var ws = new WebSocket("ws://10.0.0.146:7000");
        ws.onmessage = (message) => {
            var jsonData = JSON.parse(message.data);
            var key = "";
            var keys = Object.keys(jsonData);
            console.log(keys);

            if (keys.length != 0) {
                key = keys[0];
            }
            
            switch (key) {
                case "length":
                    this.ipTotal = jsonData["length"];
                    ws.send(WebsocketCalls.topology)
                    console.log(this.ipTotal);
                    break;
                case "topology":
                    this.ipLength++;
                    console.log(this.ipLength);
                    this.topologies.push(jsonData["topology"]);
                    if (this.ipLength == this.ipTotal) {
                        console.log(this.topologies);
                        this.graph();
                    }
                    break;
                default:
                    console.log(jsonData.key);
            }
        };
        ws.onopen = () => {
            ws.send(WebsocketCalls.ipCount);
        };
    }
}
</script>


