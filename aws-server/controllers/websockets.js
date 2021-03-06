// Imports;
const http = require("http");
const WebSocketServer = require("websocket").server


const demoWebSocket = () => {
    let connection = null;

    const httpserver = http.createServer((req, res) => {
        console.log("Server have recived a request");
    });

    const websocket = new WebSocketServer({
        "httpServer": httpserver,
        "path": "getSiteID"
    })

    httpserver.listen(8080, () => console.log(`Server is listening on 'ws://localhost:8080/getSiteID'`));

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


module.exports = {
    demoWebSocket
}