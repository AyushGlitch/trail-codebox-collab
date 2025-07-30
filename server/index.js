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

// Recursively read all files from a directory
function readWorkspaceFiles(dirPath, relativePath = '') {
  const files = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
      
      if (stats.isDirectory()) {
        // Recursively read subdirectory
        files.push(...readWorkspaceFiles(fullPath, itemRelativePath));
      } else if (stats.isFile()) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const ext = path.extname(item).toLowerCase();
          
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
          
          files.push({
            id: itemRelativePath,
            name: itemRelativePath,
            language: getLanguage(ext),
            content: content
          });
        } catch (error) {
          console.warn(`Failed to read file ${fullPath}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error(`Failed to read directory ${dirPath}:`, error.message);
  }
  
  return files;
}

// API endpoint to get workspace files
app.get('/api/workspace', (req, res) => {
  try {
    const workspaceDir = path.join(__dirname, 'workspace');
    
    if (!fs.existsSync(workspaceDir)) {
      console.warn('Workspace directory does not exist, creating it...');
      fs.mkdirSync(workspaceDir, { recursive: true });
      return res.json([]);
    }
    
    const workspaceFiles = readWorkspaceFiles(workspaceDir);
    
    console.log(`Found ${workspaceFiles.length} files in workspace`);
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
