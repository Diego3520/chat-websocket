const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let count = 1;
let clients = new Map();

wss.on('connection', (ws) => {
    const username = `Usuario_${count++}`;
    clients.set(ws, username);

    broadcast(`${username} se ha conectado.`);

    ws.on('message', (message) => {
        broadcast(`${username}: ${message}`);
    });

    ws.on('close', () => {
        clients.delete(ws);
        broadcast(`${username} se ha desconectado.`);
    });
});

function broadcast(message) {
    clients.forEach((_, client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

server.listen(8080, () => {
    console.log('Servidor WebSocket corriendo en http://localhost:8080');
});
