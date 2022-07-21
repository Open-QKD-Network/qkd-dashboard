// IMPORTS.
const { json } = require("express");
const http = require("http");
const { connections } = require("mongoose");
const WebSocketServer = require("websocket").server
const WebSocketClient = require("ws")
const WebsocketCalls = require("../../../constants/websocketCalls").WebsocketCalls;
const ipInfo = require("../models/ipInfo");

require('dotenv').config();


/**
 * Backend websocket channel class.
 */
module.exports = class websocketControllers{

    constructor () {
        this.ipAddresses = [];
        this.websocketChannels = {};
        this.connections = [];
        this.crearteIpAdresses();
        this.createWebSocket();
    }

    /**
     * Creates websocket server on backend
     */
    createWebSocket = function() {
        const httpserver = http.createServer((req, res) => {
            console.log("We have recived a request");
        });
    
        const websocket = new WebSocketServer({
            "httpServer": httpserver,
        })
    
        httpserver.listen(process.env.PORT_WS, () => console.log(`Server is listening on ws://${process.env.ADDRESS}:${process.env.PORT_WS}`));
        
        /**
         * This is the main websocket logic handler (specifically message).
         */
        websocket.on("request", request => {
    
            var connection = request.accept(null, request.origin);
            connection.on("open", () => console.log("OPENED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("close", () => {
                this.connections.splice(this.connections.indexOf(connection), 1);
                console.log("CLOSED CONNECTION ON ORIGIN: " + request.origin)
            });
            connection.on("message", message => {
                console.log("RECIEVED MESSAGE!");
                switch(message.utf8Data) {
                    case  WebsocketCalls.ipCount: // Requested Topology.
                        /**
                         * In this case, we loop through all IP addresses and send a request to 
                         * all with a topology message.
                         */
                        try {
                            connection.send(JSON.stringify({length: this.ipAddresses.length}));
                        } catch (e) {
                            console.log(e);
                        }
                        break;
                    case  WebsocketCalls.keyCount: // Requested Topology.
                        /**
                         * In this case, we loop through all IP addresses and send a request to 
                         * all with a topology message.
                         */
                        try {
                            for (var ip in this.websocketChannels) {
                                this.websocketChannels[ip].send(WebsocketCalls.keyCount);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        break;
                        
                    default :
                        console.log("INVALID MESSAGE DATA.");
                }

            });
        });
    
    }


    /**
     * Creates list with all available IP addresses.
     */
    crearteIpAdresses = async function() {
        var ipInfoJson = await ipInfo.find();

        for (var i in ipInfoJson) {
            this.ipAddresses.push(ipInfoJson[i].ip);
            this.crearteWebsocketChannels(i);
        }
    }


    /**
     * Creates websocket client on backend for all IP addresses.
     */
    crearteWebsocketChannels = function(index) {
        var ip = this.ipAddresses[index];
        var ws = new WebSocketClient(`ws://${this.ipAddresses[index]}:7070/api/v1`);
        ws.onerror = (e) => {
            console.log(`ERROR AT ${ip}: ${e.message}`);
            this.ipAddresses.splice(index, 1);
        }

        ws.onmessage = (message) => {
            for (var i in this.connections) {
                this.connections[i].send(JSON.stringify({[ip]: JSON.parse(message.data)}));
            }
            
        }

        this.websocketChannels[this.ipAddresses[index]] = ws;
    
        
    }

}

