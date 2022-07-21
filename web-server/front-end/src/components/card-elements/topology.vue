<template>
    <div  class="container">
        <div class="row align-items-center">
            <div class="d-flex justify-content-center" id="topologyCanvas"></div>
        </div>
    </div>
</template>

<script>
import fetch from 'node-fetch';


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

    async mounted() {
        await fetch("http://localhost:8001/api/v1/sites/fetch")
            .then(response => response.json())
            .then((jsonResponse) => {
                this.topologies = jsonResponse;
                this.graph();
            });
    }
}
</script>


