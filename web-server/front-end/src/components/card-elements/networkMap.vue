<template>
    <div id="networkMap"></div>
</template>

<script>
import fetch from 'node-fetch';
import Plotly from'plotly.js-dist'
import Constants from "../../config.js";
import WebSocketConstants from "../../../../../constants/websocketCalls";
import _ from "lodash";

export default {
    name: 'NetworkMap',
    /**
     * Returns Variables.
     */
    data(){
        return {
            ipValues: [], // IP values.
            topologies: [], // List of topology JSON objects.
            locations: [], // List of location JSON objects.
            ConnectionInfo: {},
            dataLineStruct: { // Structure of lines map.        
                type: 'scattergeo',
                lat: [],
                lon: [],
                mode: 'lines', 
                hoverinfo: "skip",
                line:{
                    width: 3,
                    color: 'red'
                },
                marker : {
                    colorbar: {
                    bordercolor: 'rgb(0, 0, 0)',
                    }
                }  
            },
            dataPointStruct: { // Structure of points on map                
                type: 'scattergeo',
                lat: [],
                lon: [],
                mode: 'markers',
                hoverinfo: 'name',
                name: '',
                marker : {
                    color: "#000000",
                    cmin: 500,
                    cmax: 1000
                }  
            }
        }
    },
    // Method Functions
    methods: {
        /**
         * Creates node map by looping though @topologies and adding an edge between each location and its neighbour.
         */
        async map() {
            console.log("MAPPING");
            var data = [];

            for (var i in this.topologies) {
                var local = this.topologies[i].current
                var localIp = local.ip
                var locationInfo = {}

                await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/ipInfo/fetch/ip/${localIp}`)
                    .then(response => response.json())
                    .then((jsonResponse) => {
                        var locationId = jsonResponse.locationId;
                        for (var j in this.locations) {
                            if (this.locations[j]._id == locationId) {
                                locationInfo.lon = parseFloat(this.locations[j].longitude);
                                locationInfo.lat = parseFloat(this.locations[j].latitude);
                                
                                var tmpDataPointStruct = JSON.parse(JSON.stringify(this.dataPointStruct));
                                tmpDataPointStruct.lon.push(locationInfo.lon);
                                tmpDataPointStruct.lat.push(locationInfo.lat);
                                tmpDataPointStruct["name"] = this.locations[j].city
                                
                                data.push(tmpDataPointStruct);

                                break;
                            }
                        }
                    });



                var neighbours = this.topologies[i].neighbours;
                for (var j in neighbours) {
                    var neighbourIp = neighbours[j].ip;
                    var neighbourInfo = {}

                    await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/ipInfo/fetch/ip/${neighbourIp}`)
                        .then(response => response.json())
                        .then((jsonResponse) => {
                            var locationId = jsonResponse.locationId;
                            for (var k in this.locations) {
                                if (locationId == this.locations[k]._id) {
                                    neighbourInfo.lon = parseFloat(this.locations[k].longitude);
                                    neighbourInfo.lat = parseFloat(this.locations[k].latitude);

                                    var tmpDataLineStruct = JSON.parse(JSON.stringify(this.dataLineStruct));
                                    tmpDataLineStruct.lat = [neighbourInfo.lat, locationInfo.lat];
                                    tmpDataLineStruct.lon = [neighbourInfo.lon, locationInfo.lon];
                                    if (this.ConnectionInfo[local.siteId] != undefined && this.ConnectionInfo[local.siteId][neighbours[j].siteId] != undefined) {
                                        console.log(`${local.siteId} : ${neighbours[j].siteId}`);
                                        console.log(this.ConnectionInfo[local.siteId]);
                                        console.log(this.ConnectionInfo[local.siteId][neighbours[j].siteId]);
                                        tmpDataLineStruct.line.color = "green";
                                    }
                                    data.push(tmpDataLineStruct);

                                    break;
                                }
                            }
                        });

                }

            }


            
            var layout = {
                showlegend: false,
                margin: { r: 0, t: 0, b: 0, l: 0 },
                geo: {
                resolution: 30,
                showland: true,
                showlakes: true,
                showocean: true,
                showcountries: true,
                subunitcolor:"Blue",
                landcolor: 'rgb(204, 204, 204)',
                countrycolor: 'black',
                lakecolor: '#1da2d8',
                oceancolor: '#1da2d8',
                projection: {
                    type: 'equirectangular'
                },
                coastlinewidth: 2,
                lataxis: {
                    range: [ 20, 60 ],
                    showgrid: true,
                    tickmode: 'linear',
                    dtick: 10
                },
                lonaxis:{
                    range: [-100, 20],
                    showgrid: true,
                    tickmode: 'linear',
                    dtick: 20
                }
                }
            };

            Plotly.newPlot('networkMap', data, layout);
        }
    }, 

    /**
     * Mounted class once webpage is up. Fetches locations and sites from backend.
     */
    async mounted() {
        await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/location/fetch`)
            .then(response => response.json())
            .then((jsonResponse) => {
                this.locations = jsonResponse;
            });

        await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/sites/fetch`)
            .then(response => response.json())
            .then((jsonResponse) => {
                this.topologies = jsonResponse;
                this.map();
            });

    var ws = new WebSocket(`ws://${Constants.PUBLIC_IP}:8002`);
    ws.onopen = () => {
        ws.send(WebSocketConstants.WebsocketCalls.connectionStatus);
    }

    ws.onmessage = (message) => {
        var data = JSON.parse(message.data);
        for (var i in data) {
            if (data[i].ConnectionInfo != undefined) {
                if (!_.isEqual(this.ConnectionInfo, data[i].ConnectionInfo)) {
                    console.log(this.ConnectionInfo);
                    console.log(data[i].ConnectionInfo);
                    this.ConnectionInfo = data[i].ConnectionInfo;
                    this.map();
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


