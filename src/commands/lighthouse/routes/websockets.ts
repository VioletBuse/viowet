import { Server } from "http"
import { WebSocketServer } from "ws"

const wss = new WebSocketServer({ noServer: true })

export const register_websocket_server = (server: Server) => {
    server.on('upgrade', function (request, socket, head) {
        socket.on('error', console.error);

        wss.handleUpgrade(request, socket, head, () => { })
    })
}
