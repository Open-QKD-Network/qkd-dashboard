// Imports;
const http = require("http");
const WebSocketServer = require("websocket").server;
const logic = require("./logic");


/**
 * Websocket logic controllers.
 */
module.exports = class websocketControllers{
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
            "path": "getTopology"
        })

        httpserver.listen(process.env.PORT, () => console.log(`SERVER IS LISTENING ON 'ws://${process.env.ADDRESS}:${process.env.PORT}/getTopology'`));

        websocket.on("request", request => {

            connection = request.accept(null, request.origin);
            connection.on("open", () => console.log("OPENED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("close", () => console.log("CLOSED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("message", message => {
                try {
                connection.send(logic.getTopology());
                } catch (e) {
                    console.log(e);
                }
            });
        });

    }
    /**
     * Creates a websocket connection that send the curent QKD connection status on message.
     */
    static ConectionStatusWebSocket () {
        let connection = null;

        const httpserver = http.createServer((req, res) => {
            console.log("SERVER CREATED.");
        });

        const websocket = new WebSocketServer({
            "httpServer": httpserver,
            "path": "getConnectionStatus"
        })

        httpserver.listen(8080, () => console.log(`SERVER IS LISTENING ON 'ws://localhost:8080/getConnectionStatus'`));

        websocket.on("request", request => {

            connection = request.accept(null, request.origin);
            connection.on("open", () => console.log("OPENED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("close", () => console.log("CLOSED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("message", message => {
                try {
                connection.send(logic.getSiteId());
                } catch (e) {
                    console.log(e);
                }
            });
            
        });

    }

    /**
     * Creates a websocket connection that sends IP adress conections on message.
     */
    static IpConnectionsWebsocket () {
        let connection = null;

        const httpserver = http.createServer((req, res) => {
            console.log("SERVER CREATED.");
        });

        const websocket = new WebSocketServer({
            "httpServer": httpserver,
            "path": "ipConnections"
        })

        httpserver.listen(8080, () => console.log(`SERVER IS LISTENING ON 'ws://localhost:8080/ipConnections'`));

        websocket.on("request", request => {

            connection = request.accept(null, request.origin);
            connection.on("open", () => console.log("OPENED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("close", () => console.log("CLOSED CONNECTION ON ORIGIN: " + request.origin));
            connection.on("message", message => {
                try {
                connection.send("RECIVED");
                } catch (e) {
                    console.log(e);
                }
            });
            
        });

    }

}