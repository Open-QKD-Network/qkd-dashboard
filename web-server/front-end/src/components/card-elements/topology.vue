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

  // Method Functions
  methods: {
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
        console.log(message);
        this.graph(JSON.parse(message.data));
    };
    ws.onopen = () => {
        ws.send(WebsocketCalls.topology)
    };
  }
}
</script>


