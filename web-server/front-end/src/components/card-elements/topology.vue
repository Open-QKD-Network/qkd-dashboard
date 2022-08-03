<template>
    <div  class="container">
        <div class="row align-items-center" id="topologyDiv">
            <div class="d-flex justify-content-center" style="height: 400px;" id="topologyCanvas"></div>
        </div>
    </div>
</template>

<script>
import fetch from 'node-fetch';
import Constants from "../../config.js";
import WebSocketConstants from "../../../../../constants/websocketCalls";
import vis from "vis";

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

            idCount: 0,

            nodeDataSet: [],
            edgeDataSet: [],
            
            nodeDictionary: {},
            edgeDictionary: {},

            nodes: undefined,
            edges: undefined

        }
    },
    // Method Functions
    methods: {
        createNode(ipAddress, siteId) {
            if (this.nodeDictionary[siteId] == undefined) {
                var id = this.idCount;
                this.idCount++;
                this.nodeDictionary[siteId] = id;
                this.nodeDataSet.push({ id: id, label: `${siteId} - ${ipAddress}` });
            } else {
                return null;
            }
        },
        createEdge(fromSite, toSite) {
            const identifier = `${fromSite}-${toSite}`;
            const inverse = `${toSite}-${fromSite}`;

            if (this.edgeDictionary[identifier] == undefined && this.edgeDictionary[inverse] == undefined) {
                var id = this.idCount;
                this.idCount++;
                this.edgeDictionary[identifier] = id;
                const from = this.nodeDictionary[fromSite];
                const to = this.nodeDictionary[toSite];
                this.edgeDataSet.push({ from: from, to: to , color: {color: '#ff0000'}});
            } else {
                return null
            }
        },
        /**
         * Creates node graph by looping though @topologies and adding an edge bwtween each IP and its neighbour.
         */
        graph() {

            for (var i in this.topologies) {
                var currentSiteId = this.topologies[i]["current"]["siteId"];
                var currentIp = this.topologies[i]["current"]["ip"];
                this.createNode(currentIp, currentSiteId);

                var neighbours = this.topologies[i]["neighbours"]
                for (var j in neighbours) {
                    var neigbourSiteId = neighbours[j]["siteId"];
                    var neigbourIp = neighbours[j]["ip"];
                    this.createNode(neigbourIp, neigbourSiteId);

                    this.createEdge(currentSiteId, neigbourSiteId);

                }
            }

            this.nodes = new vis.DataSet(this.nodeDataSet);

            this.edges = new vis.DataSet(this.edgeDataSet);

            // create a network
            var container = document.getElementById("topologyCanvas");
            var data = {
            nodes: this.nodes,
            edges: this.edges,
            };
            var options = {};
            new vis.Network(container, data, options);
        },


        regraph() {
            console.log(this.ConnectionInfo);
            for (var i in this.ConnectionInfo) {
                for(var j in this.ConnectionInfo[i]) {
                    if (this.edgeDictionary[`${i}-${j}`] != undefined) {
                        this.edges.update([{
                            id: this.edgeDictionary[`${i}-${j}`],
                            color: {color: '#00ff00'}
                        }]);
                    }
                }
            }
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
                        console.log(data)
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

