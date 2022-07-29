// Imports;
const http = require("http");
const WebSocketServer = require("websocket").server;
const KeyProduction = require("./keyProduction");
const Connection = require("./connections");
require('dotenv').config()
const WebsocketCalls = require("../../constants/websocketCalls").WebsocketCalls;


/**
 * Websocket Class.
 */
module.exports = class WebsocketControllers {

    constructor () {
        this.connections = [];
        this.createWebSocket();
        this.keyProductionClass = new KeyProduction;
    }

    /**
     * Creates a websocket connection on message.
     */
    createWebSocket = function () {
        const httpserver = http.createServer((req, res) => {
            console.log("SERVER CREATED.");
        });

        const websocket = new WebSocketServer({
            "httpServer": httpserver,
            "path": "api/v1"
        })


        httpserver.listen(process.env.PORT_WS, () => console.log(`RUNNIG WS CONNECTION ON 'ws://${process.env.ADDRESS}:${process.env.PORT_WS}/api/v1'`));

        websocket.on("request", request => {

            var connection = request.accept(null, request.origin);
            connection.on("open", () => console.log("OPENED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("close", () => {
                this.connections.splice(this.connections.indexOf(connection), 1);
                console.log("CLOSED CONNECTION ON ORIGIN: " + request.origin);
            });
            connection.on("message", message => {
                switch(message.utf8Data) {
                    /**
                     * In this case, we will send back the keyInfo of the local machine by invoking
                     * sendKeyInfo().
                     */
                    case WebsocketCalls.keyInfo:
                        try {
                            this.sendKeyInfo(1);
                        } catch (e) {
                            console.error(e);
                        }
                        break;
                     /**
                     * In this case, we will send back the Connection status by invoking sendConenctionInfo().
                     */
                      case WebsocketCalls.connectionStatus:
                        try {
                            this.sendConenctionInfo();
                        } catch (e) {
                            console.error(e);
                        }
                        break;
                    default:
                        console.log("INVALID MESSAGE DATA.");
                };
                
            });
            this.connections.push(connection);
        });

    }
    
    /**
     * Sends Key information through websocket connection.
     * @param {Int} time Time between calls, in seconds.
     */
    sendKeyInfo = function(time) {
        var keyRates = this.keyProductionClass.calculateKeyRate(time);
        var keyCounts = this.keyProductionClass.calculateKeyCount();
        for (var i in this.connections) {
            this.connections[i].send(JSON.stringify({KeyInfo : {keyRates: keyRates, keyCounts: keyCounts}}));
        }
    }

    /**
     * Sends Key information through websocket connection.
     * @param {Int} time Time between calls, in seconds.
     */
     sendConenctionInfo = function() {
        if (!Connection.checkIfFileExists) return;

        for (var i in this.connections) {
            this.connections[i].send(JSON.stringify({ConnectionInfo: Connection.findConnectionStatus()}));
        }
    }    
}