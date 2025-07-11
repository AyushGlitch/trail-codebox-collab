import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
import http from 'http';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint to get workspace files
app.get('/api/workspace', (req, res) => {
  try {
    const workspaceDir = path.join(__dirname, 'workspace');
    const files = fs.readdirSync(workspaceDir);
    
    const workspaceFiles = files.map(filename => {
      const filePath = path.join(workspaceDir, filename);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const ext = path.extname(filename).toLowerCase();
        
        // Determine language from extension
        const getLanguage = (ext) => {
          switch (ext) {
            case '.ts': case '.tsx': return 'typescript';
            case '.js': case '.jsx': return 'javascript';
            case '.py': return 'python';
            case '.md': return 'markdown';
            case '.json': return 'json';
            case '.css': return 'css';
            case '.html': return 'html';
            case '.yml': case '.yaml': return 'yaml';
            case '.xml': return 'xml';
            case '.sql': return 'sql';
            default: return 'plaintext';
          }
        };
        
        return {
          id: filename,
          name: filename,
          language: getLanguage(ext),
          content: content
        };
      }
      return null;
    }).filter(Boolean);
    
    res.json(workspaceFiles);
  } catch (error) {
    console.error('Error reading workspace:', error);
    res.status(500).json({ error: 'Failed to read workspace files' });
  }
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (conn, req) => {
  console.log('New WebSocket connection');
  setupWSConnection(conn, req, {
    gc: true, // Enable garbage collection
  });
});

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
}); 