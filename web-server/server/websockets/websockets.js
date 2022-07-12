// IMPORTS.
const { json } = require("express");
const http = require("http");
const WebSocketServer = require("websocket").server
const WebSocketClient = require("ws")
require('dotenv').config();

/**
 * Backend websocket channel class.
 */
module.exports = class websocketControllers{
    static ipAddresses = [];
    static websocketChannels = {};
    static response = {};
    static count = 0;
    static connection = null;
    

    constructor () {
        this.crearteIpAdresses();
        this.crearteWebsocketChannels();
        this.createWebSocket();
    }

    /**
     * Creates websocket server on backend
     */
    static createWebSocket() {
        
    
        const httpserver = http.createServer((req, res) => {
            console.log("We have recived a request");
        });
    
        const websocket = new WebSocketServer({
            "httpServer": httpserver,
        })
    
        httpserver.listen(process.env.PORT_WS, () => console.log(`Server is listening on ws://${process.env.ADDRESS}:${process.env.PORT_WS}`));
    
        websocket.on("request", request => {
    
            connection = request.accept(null, request.origin);
            connection.on("open", () => console.log("OPENED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("close", () => console.log("CLOSED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("message", message => {
                try {
                    for (var ip in this.websocketChannels) {
                        this.websocketChannels[ip].send("");
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        });
    
    }

    /**
     * Creates list with all available IP addresses.
     */
    static crearteIpAdresses() {
        /**TODO */

    }

    /**
     * Creates websocket client on backend for all IP addresses.
     */
    static crearteWebsocketChannels() {
        for (var ip in this.ipAddresses) {
            var ws = new WebSocketClient(`ws://${ip}:8080/api/v1`);
            ws.onmessage = (message) => {
                this.count++;
                this.response[ip] = message.data;
            }
            this.websocketChannels[ip] = ws;
        }
    }

    static checkForCompletion() {
        if (this.count == this.ipAddresses.length) {
            connection.send(JSON.stringify(response));
        }
        this.response = {};
        this.count = 0;
    }
}

