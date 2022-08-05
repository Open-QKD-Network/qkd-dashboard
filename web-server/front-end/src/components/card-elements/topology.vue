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

            idCount: 0, // ID tracker

            nodeDataSet: [], // List of the Node dataset used by vis
            edgeDataSet: [], // List of the edge dataset used by vi
            
            nodeDictionary: {}, // KVP of the site and its ID
            edgeDictionary: {}, // KVP of the edge and the information provided by the edge

            nodes: undefined, // Nodes object
            edges: undefined // Edges object

        }
    },
    // Method Functions
    methods: {


        /**
         * Adds a node to the node object
         * @param {String} ipAddress IP address of node.
         * @param {String} siteId Site ID of node.
         */
        createNode(ipAddress, siteId) {
            if (this.nodeDictionary[siteId] == undefined) {
                const id = this.idCount;
                this.idCount++;
                this.nodeDictionary[siteId] = id;
                
                const color = "#" +  Math.floor((Math.random() * 0xFFFFFF)).toString(16);

                this.nodeDataSet.push({ id: id, label: `${siteId} - ${ipAddress}`, color: color});
            } else {
                return null;
            }
        },


        /**
         * Adds edge from fromSite to toSite
         * @param {String} fromSite Site ID of one end.
         * @param {String} toSite Site ID of other end.
         */
        createEdge(fromSite, toSite) {
            const identifier = `${fromSite}-${toSite}`;
            const inverse = `${toSite}-${fromSite}`;

            if (this.edgeDictionary[identifier] == undefined && this.edgeDictionary[inverse] == undefined) {
                const id = this.idCount;
                this.idCount++;
                const from = this.nodeDictionary[fromSite];
                const to = this.nodeDictionary[toSite];
                this.edgeDictionary[identifier] = {id: id, from: fromSite, to: toSite};
                this.edgeDataSet.push({ id: id, from: from, to: to , color: {color: '#ff0000'}});
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
            var options = {
                layout: { clusterThreshold: 200},
                physics: {
                    stabilization: false,
                    barnesHut: {
                        springLength: 500,
                        springConstant: 0
                    },
                },
                nodes: {
                    shape: "dot",
                    size: 25,
                    font: {
                        size: 15,
                    },
                    borderWidth: 1,
                },
                edges: {
                    width: 3,
                    length: 400,
                    color: {
                        inherit: false,
                    }
                },
                smooth: false
            };
            new vis.Network(container, data, options);
        },

        /**
         * Regraphs the exiting topology.
         */
        regraph() {
            for (var i in this.edgeDictionary) {
                const from = this.edgeDictionary[i].from;
                const to = this.edgeDictionary[i].to;
                
                if (this.ConnectionInfo[from] != undefined && this.ConnectionInfo[to] != undefined &&
                    this.ConnectionInfo[from][to] != undefined && this.ConnectionInfo[to][from] != undefined) {
                    this.edges.update([{
                            id: this.edgeDictionary[`${from}-${to}`].id,
                            color: {color: '#00ff00'}
                        }]);
                } else {
                    this.edges.update([{
                            id: this.edgeDictionary[`${from}-${to}`].id,
                            color: {color: '#ff0000'}
                        }]);
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

