// Importa el módulo 'ws' para manejar conexiones WebSocket
const WebSocket = require('ws');

// Importa el módulo 'http' para crear un servidor HTTP (necesario para 'ws')
const http = require('http');

// Crea un servidor HTTP vacío (sin manejo de rutas, solo para soporte WebSocket)
const server = http.createServer();

// Crea una instancia de servidor WebSocket utilizando el servidor HTTP creado
const wss = new WebSocket.Server({ server });

// Inicializa un contador para asignar nombres únicos a los usuarios
let count = 1;

// Crea un mapa (estructura tipo diccionario) para asociar cada cliente WebSocket con su nombre de usuario
let clients = new Map();

// Evento que se dispara cuando un cliente se conecta al servidor WebSocket
wss.on('connection', (ws) => {
    // Asigna un nombre único al nuevo usuario (ej.: Usuario_1, Usuario_2, etc.)
    const username = `Usuario_${count++}`;
    
    // Guarda la conexión del cliente y su nombre en el mapa 'clients'
    clients.set(ws, username);

    // Notifica a todos los clientes que un nuevo usuario se ha conectado
    broadcast(`${username} se ha conectado.`);

    // Evento que se dispara cuando este cliente envía un mensaje
    ws.on('message', (message) => {
        // Reenvía el mensaje recibido a todos los clientes incluyendo quién lo envió
        broadcast(`${username}: ${message}`);
    });

    // Evento que se dispara cuando el cliente cierra la conexión
    ws.on('close', () => {
        // Elimina al cliente del mapa 'clients'
        clients.delete(ws);
        // Notifica a todos que este usuario se ha desconectado
        broadcast(`${username} se ha desconectado.`);
    });
});

// Función que envía un mensaje a todos los clientes conectados
function broadcast(message) {
    clients.forEach((_, client) => {
        // Verifica que la conexión esté abierta antes de enviar
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Inicia el servidor HTTP (y WebSocket) escuchando en el puerto 8080
server.listen(8080, () => {
    console.log('Servidor WebSocket corriendo en http://localhost:8080');
});

