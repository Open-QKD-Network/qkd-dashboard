// IMPORTS
const websocket = require("./controllers/websockets");
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT_REST;

// Middleware.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("uploads"));

// API routes.
app.use("/api/v1/siteInformation", require("./routes/siteInformationRoutes"));

// Websocket Initilizer.
websocket.topologyWebSocket();

app.listen(port, () => console.log("RUNNING HTTP CONNECTION..."));

