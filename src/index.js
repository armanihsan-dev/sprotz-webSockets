import express from "express";
import { matchRouter } from "./routes/matches.js";
import http from "node:http";
import {attachWebSocketServer} from "./ws/server.ws.js";


const PORT = Number(process.env.PORT || '3000')  // PORT should be a number ✓
const HOST = process.env.HOST || '0.0.0.0'       // HOST should be a string ✓
const app = express();
const server = http.createServer(app)


// Middleware
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

app.use('/matches', matchRouter)

const {broadCastMatchCreated}= attachWebSocketServer(server)
app.locals.broadCastMatchCreated = broadCastMatchCreated

// Start Server
server.listen(PORT, HOST, () => {                  // HOST is now a string
    const baseUrl = HOST === '0.0.0.0'
        ? `http://localhost:${PORT}`
        : `http://${HOST}:${PORT}`

    console.log(`Server running on ${baseUrl}`);
    console.log(`WebSocket server is running on ${baseUrl.replace('http','ws')}/ws`)
});