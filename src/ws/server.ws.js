import {WebSocket, WebSocketServer} from "ws";
import {wsArcjet} from "../arcjet.js";

function sendJSON(socket, payload) {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
}

function broadCast(wss, payload) {
    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;
        client.send(JSON.stringify(payload));
    }
}

export function attachWebSocketServer(server) {
    const wss = new WebSocketServer({
        server,
        path: "/ws",
        maxPayload: 1024 * 1024,
    });

    wss.on("connection", async (socket, req) => {
        console.log('requst comming')
        if (wsArcjet) {
            try {
                const decision = await wsArcjet.protect(req);
                if (decision.isDenied()) {
                    const code = decision.reason.isRateLimit() ? 1013 : 1008;
                    const reason = decision.reason.isRateLimit()
                        ? "rate limit exceeded"
                        : "forbidden";
                    socket.close(code, reason);
                    return
                }
            } catch (err) {
                console.log("WS Arcjet error", err);
                socket.close(1011, "service security error");
                return;
            }
        }

        socket.isAlive = true;
        socket.on("pong", () => {
            socket.isAlive = true;
        });

        sendJSON(socket, {type: "welcome"});

        socket.on("message", async (data) => {
            if (wsArcjet) {
                try {
                    const decision = await wsArcjet.protect(req);
                    if (decision.isDenied()) {
                        socket.close(1008, "rate limit exceeded");

                    }
                } catch (err) {
                    console.log("WS Arcjet message error", err);
                }
            }
        });

        socket.on("error", console.error);
    });

    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on("close", () => clearInterval(interval));

    function broadcastMatchCreated(match) {
        broadCast(wss, {type: "match_created", data: match});
    }

    return {broadcastMatchCreated};
}
