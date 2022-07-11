// Imports.
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const websocket = require('./controllers/websocket');

const app = express();
const port = process.env.PORT; // check .env for such constants

// Middleware.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("uploads"));

// Database connection.
mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("CONNECTED TO DATABASE"))
    .catch((err) => console.log("FAILED TO CONNECT TO DATABASE '" + process.env.DB_URI + "' : " + err));

// Routes Prefix.   
app.use("/api/v1/location", require("./routes/locationRoutes"));
app.use("/api/v1/topology", require("./routes/topologyRoutes"));

// Websocket Prefix.
websocket.demoWebSocket();


// Start Server.
app.listen(port, () => console.log("RUNNING SERVER..."));
