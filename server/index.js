import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
import http from 'http';

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (conn, req) => {
  console.log('New WebSocket connection');
  setupWSConnection(conn, req, {
    gc: true, // Enable garbage collection
  });
});

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
}); 