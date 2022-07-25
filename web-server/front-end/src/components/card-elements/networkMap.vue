<template>
    <div id="networkMap"></div>
</template>

<script>
import fetch from 'node-fetch';
import Plotly from'plotly.js-dist'
import Constants from "../../config.js";


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
            dataLineStruct: { // Structure of lines map.
                type: 'scattergeo',
                lat: [],
                lon: [],
                mode: 'lines',
                line:{
                    width: 2,
                    color: 'green'
                },
            },
            dataPointStruct: { // Structure of points on map
                type: 'scattergeo',
                lat: [],
                lon: [],
                mode: 'point',
                line:{
                    width: 2,
                    color: 'black'
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
            var data = [];

            for (var i in this.topologies) {
                var localIp = this.topologies[i].current.ip
                var locationInfo = {}

                await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/ipInfo/fetch/ip/${localIp}`)
                    .then(response => response.json())
                    .then((jsonResponse) => {
                        var locationId = jsonResponse.locaionId;
                        for (var j in this.locations) {
                            if (this.locations[j]._id == locationId) {
                                locationInfo.lon = parseFloat(this.locations[j].longitude);
                                locationInfo.lat = parseFloat(this.locations[j].latitude);
                                
                                var tmpDataPointStruct = this.dataPointStruct;
                                tmpDataPointStruct.lat.push(locationInfo.lon);
                                tmpDataPointStruct.lon.push(locationInfo.lat);

                                data.push(tmpDataPointStruct);

                                break;
                            }
                        }
                    });



                var neighbours = this.topologies[i].neighbours;
                for (var j in neighbours) {
                    var neighbourIp = neighbours[j].ip;
                    var neighbourInfo = {}
                    console.log(localIp + " - " + neighbourIp);

                    await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/ipInfo/fetch/ip/${neighbourIp}`)
                        .then(response => response.json())
                        .then((jsonResponse) => {
                            var locationId = jsonResponse.locaionId;
                            for (var k in this.locations) {
                                if (locationId == this.locations[k]._id) {
                                    neighbourInfo.lon = parseFloat(this.locations[k].longitude);
                                    neighbourInfo.lat = parseFloat(this.locations[k].latitude);

                                    var tmpDataLineStruct = this.dataLineStruct;
                                    tmpDataLineStruct.lat = [neighbourInfo.lon, locationInfo.lon];
                                    tmpDataLineStruct.lon = [neighbourInfo.lat, locationInfo.lat];
                                    data.push(tmpDataLineStruct);

                                    break;
                                }
                            }
                        });

                }

            }


            
            console.log(data);

            var layout = {
            showlegend: false,
            geo: {
                resolution: 20,
                showland: true,
                showlakes: true,
                landcolor: 'rgb(204, 204, 204)',
                countrycolor: 'rgb(204, 204, 204)',
                lakecolor: 'rgb(255, 255, 255)',
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

    async mounted() {
        await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/location/fetch`)
            .then(response => response.json())
            .then((jsonResponse) => {
                console.log(jsonResponse);
                this.locations = jsonResponse;
            });

        await fetch(`http://${Constants.PUBLIC_IP}:8001/api/v1/sites/fetch`)
            .then(response => response.json())
            .then((jsonResponse) => {
                this.topologies = jsonResponse;
                this.map();
            });

    }
}
</script>


