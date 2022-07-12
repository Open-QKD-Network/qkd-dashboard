const WebSocketClient = require("ws")
/**
 * Topology controller class.
 */
module.exports = class topologyController {

    /**
     * 
     * @param {String} ipAddress IP address of websocket server.
     * @param {any} port Port of websocket server. 
     */
   static getTopology(ipAddress, port) {

        console.log(`ws://${ipAddress}:${port}/getTopology`)
        var ws = new WebSocketClient(`ws://${ipAddress}:${port}/getTopology`)

        var topologyClass = new TopologyWebsocket(ws);

        return topologyClass.topology;
    }

    awaitMessage(topologyClass) {
        if(topologyClass != undefined) {
            setTimeout(() => {});
        }
    }
}
class TopologyWebsocket {

    constructor(ws) {
        this.onOpenTopology(ws);
        this.onMessageTopology(ws);
    }

    onOpenTopology(ws) {
        ws.onopen = () => {
            this.sendMessage(ws);
        };
    }

    onMessageTopology (ws) {
        ws.onmessage = (message) => {
            this.topology = message.data;
        };
    }

    sendMessage(ws) {
        console.log("SENDING");
        ws.send("");
        console.log("SENT");
    }

}