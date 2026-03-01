
import {WebSocket, WebSocketServer} from 'ws'

function  sendJSON(socket,payload) {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
}

function broadCast(wss,payload){
    for(const client of wss.clients){
        if(client.readyState !== WebSocket.OPEN) continue
        client.send(JSON.stringify(payload))
    }
}


export function attachWebSocketServer(server){
    const wss = new WebSocketServer({ server, path:'/ws', maxPayload: 1024*1024 })
    wss.on('connection',(socket)=>{
        sendJSON(socket,{type:"Wel-come"})
        socket.on('error', console.error)
    })

    function broadCastMatchCreated(match){
        broadCast(wss, {type:"match_created", data:match})
    }

    return { broadCastMatchCreated }
}