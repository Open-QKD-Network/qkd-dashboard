// Imports;
const http = require("http");
const WebSocketServer = require("websocket").server;
const topology = require("./topology");
require('dotenv').config()
const WebsocketCalls = require("../../constants/websocketCalls").WebsocketCalls;


/**
 * Websocket Class.
 */
module.exports = class WebsocketControllers{

    /**
     * Creates a websocket connection that send siteId on message.
     */
     static topologyWebSocket () {
        let connection = null;

        const httpserver = http.createServer((req, res) => {
            console.log("SERVER CREATED.");
        });

        const websocket = new WebSocketServer({
            "httpServer": httpserver,
            "path": "api/v1"
        })


        httpserver.listen(process.env.PORT, () => console.log(`SERVER IS LISTENING ON 'ws://${process.env.ADDRESS}:${process.env.PORT}/api/v1'`));

        websocket.on("request", request => {

            connection = request.accept(null, request.origin);
            connection.on("open", () => console.log("OPENED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("close", () => console.log("CLOSED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("message", message => {
                switch(message.utf8Data) {
                    case WebsocketCalls.topology:
                        try {
                            connection.send(topology.getTopology());
                        } catch (e) {
                            console.log(e);
                        }
                        break;
                    default:
                        console.log("INVALID MESSAGE DATA.");
                };
                
            });
        });

    }
   
}