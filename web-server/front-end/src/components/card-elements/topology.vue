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
    provide:{
        ipTotal:0,
        ipLength:0,
        topologies: []
    },
    // Method Functions
    methods: {
        /**
         * 
         */
        graph(model) {
            console.log(model);
            const successStyle = {
                stroke: '#00ff00',
                fill: '#00ff00',
            };

            const failedStyle = {
                stroke: '#ff0000',
                fill: '#ff0000',
            };

            var Dracula = require('graphdracula');
            var Graph = Dracula.Graph;
            var Renderer = Dracula.Renderer.Raphael;
            var Layout = Dracula.Layout.Spring;
            
            var graph = new Graph();
            
            graph.addEdge('Banana', 'Apple');
            graph.addEdge('Apple', 'Kiwi');
            graph.addEdge('Apple', 'Dragonfruit');
            graph.addEdge('Dragonfruit', 'Banana', {style: failedStyle});
            graph.addEdge('Kiwi', 'Banana', {style: successStyle});
            
            var layout = new Layout(graph);
            layout.layout();
            var renderer = new Renderer('#topologyCanvas', graph, 1000, 400);
            renderer.draw();
        }
    }, 

    mounted() {
        var ws = new WebSocket("ws://localhost:7000");
        ws.onmessage = (message) => {
            var jsonData = JSON.parse(message.data);
            var key = "";
            var keys = Object.keys();

            if (keys.length != 0) {
                key = keys[0];
            }
            
            switch (key) {
                case "length":
                    this.ipTotal = jsonData["length"];
                    ws.send(WebsocketCalls.topology)
                case "topology":
                    this.ipCount++;
                    topologies.push(jsonData["topology"]);
                    if (this.ipCount == this.ipLength) {
                        graph(model)
                    }
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


