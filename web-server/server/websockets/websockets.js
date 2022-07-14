// IMPORTS.
const { json } = require("express");
const http = require("http");
const WebSocketServer = require("websocket").server
const WebSocketClient = require("ws")
const WebsocketCalls = require("../../../constants/websocketCalls").WebsocketCalls;
require('dotenv').config();

/**
 * Backend websocket channel class.
 */
module.exports = class websocketControllers{

    constructor () {
        this.ipAddresses = [];
        this.websocketChannels = {};
        this.response = {};
        this.count = 0;
        this.connection = null;
        this.crearteIpAdresses();
        this.crearteWebsocketChannels();
        this.createWebSocket();
        console.log(WebsocketCalls);
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
    
            this.connection = request.accept(null, request.origin);
            this.connection.on("open", () => console.log("OPENED CONNECTION ON ORIGIN: " + request.origin));
            this.connection.on("close", () => console.log("CLOSED CONNECTION ON ORIGIN: " + request.origin));
            this.connection.on("message", message => {
                console.log("RECIEVED MESSAGE!");
                switch(message.utf8Data) {
                    case  WebsocketCalls.topology: // Requested Topology.
                        /**
                         * In this case, we loop through all IP addresses and send a request to 
                         * all with a topology message.
                         */
                        try {
                            for (var ip in this.websocketChannels) {
                                this.websocketChannels[ip].send(WebsocketCalls.topology);
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
    crearteIpAdresses = function() {
        /**TODO */
        this.ipAddresses.push("10.0.0.146");
    }


    /**
     * Creates websocket client on backend for all IP addresses.
     */
    crearteWebsocketChannels = function() {
        for (var i in this.ipAddresses) {
            try {
                var ws = new WebSocketClient(`ws://${this.ipAddresses[i]}:7070/api/v1`);
                ws.onmessage = (message) => {
                    var localIp = this.ipAddresses[i];
                    this.response[localIp] = message.data;
                    this.count++;
                    this.checkForCompletion();
                }
                this.websocketChannels[this.ipAddresses[i]] = ws;
            } catch (e) {
                console.log(`ERROR AT ${this.ipAddresses[i]}: ${e.message}`);
                this.ipAddresses.splice(i, 1);
            }
        }
    }

    /**
     * Detects if all IP addresses have returned a message call and resets configuration.
     */
    checkForCompletion = function() {
        if (this.count == this.ipAddresses.length) {
            this.connection.send(JSON.stringify(this.response));
        }
        this.response = {};
        this.count = 0;
    }
}

