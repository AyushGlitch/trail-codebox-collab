# Collaborative Monaco Editor

A real-time collaborative code editor built with React, Monaco Editor, and Yjs. Multiple users can edit multiple files simultaneously with conflict-free collaborative editing.

## Features

- **Real-time collaboration**: Multiple users can edit the same files simultaneously
- **Multi-file support**: Create, edit, and delete multiple files in a single room
- **Monaco Editor**: Full VS Code-like editing experience with syntax highlighting
- **User presence**: See who's online with colored avatars
- **Conflict-free editing**: Yjs CRDT ensures no conflicts between concurrent edits
- **Persistent state**: Files persist across sessions
- **File management**: Add, delete, and switch between files with a sidebar
- **Language support**: Auto-detection of programming languages based on file extensions

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Editor**: Monaco Editor (VS Code editor)
- **Collaboration**: Yjs (Conflict-free Replicated Data Types)
- **Transport**: WebSocket (y-websocket)
- **Build Tool**: Vite
- **Icons**: Lucide React

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm run dev
   ```

   This will start both the client (port 5173) and WebSocket server (port 1234).

3. **Open the editor:**
   - Go to `http://localhost:5173`
   - You'll be redirected to `/room/demo`
   - Open the same URL in multiple tabs/browsers to test collaboration

## Usage

### Creating Rooms

- Navigate to `/room/{roomId}` to create or join a room
- Each room is completely isolated with its own set of files
- Examples:
  - `http://localhost:5173/room/my-project`
  - `http://localhost:5173/room/team-alpha`

### File Management

- **Add files**: Click the "+" button in the sidebar
- **Switch files**: Click on any file in the sidebar
- **Delete files**: Hover over a file and click the "X" button
- **Auto-save**: All changes are automatically saved and synced

### Collaboration Features

- **Real-time editing**: See changes from other users instantly
- **Cursor tracking**: See where other users are typing
- **User presence**: View online users in the top bar
- **Conflict resolution**: Yjs automatically merges concurrent edits

## Project Structure

```
├── server/
│   └── index.js              # WebSocket server
├── src/
│   ├── components/
│   │   ├── FileManager.tsx   # File sidebar
│   │   ├── SharedMonaco.tsx  # Monaco editor wrapper
│   │   ├── UserPresence.tsx  # Online users display
│   │   └── Workspace.tsx     # Main workspace
│   ├── hooks/
│   │   └── useYRoom.ts       # Yjs room management
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── package.json
└── vite.config.ts
```

## How It Works

### Collaborative Data Structure

Each room uses a single Yjs document (`Y.Doc`) that contains:
- A shared array (`Y.Array`) listing all files in the room
- Individual text documents (`Y.Text`) for each file's content
- Awareness information for user presence and cursors

### Real-time Synchronization

1. **WebSocket Connection**: Each client connects to the WebSocket server
2. **Document Sync**: Yjs automatically syncs the document state
3. **Conflict Resolution**: CRDT algorithms ensure consistency
4. **Awareness**: User cursors and presence info are shared

### File Management

- Files are stored as entries in a shared `Y.Array`
- Each file has an ID, name, and language
- Content is stored in separate `Y.Text` objects
- All operations are wrapped in Yjs transactions for atomicity

## Customization

### Adding New Languages

Edit the `getLanguage` function in `FileManager.tsx`:

```typescript
const getLanguage = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'rs': return 'rust';
    case 'go': return 'go';
    case 'php': return 'php';
    // Add more languages...
    default: return 'plaintext';
  }
};
```

### Customizing the UI

The UI uses Tailwind CSS classes. Key components:
- `FileManager.tsx`: Sidebar styling
- `UserPresence.tsx`: Top bar with user avatars
- `Workspace.tsx`: Main layout

### Server Configuration

Edit `server/index.js` to:
- Change the WebSocket port
- Add authentication
- Enable persistence with y-leveldb
- Add Redis for horizontal scaling

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker (Optional)
Create a `Dockerfile` for containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173 1234
CMD ["npm", "run", "dev"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with multiple browser tabs
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 