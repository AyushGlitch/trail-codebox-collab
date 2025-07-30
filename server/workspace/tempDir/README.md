# Collaborative Editor Workspace

Welcome to your collaborative editing workspace! This project allows multiple users to edit files together in real-time.

## Features

- **Real-time collaboration**: Multiple users can edit simultaneously
- **Conflict-free editing**: Uses Yjs CRDT for seamless merging
- **Multi-file support**: Work on multiple files in one session
- **User presence**: See who's online and where they're editing
- **Persistent state**: Your changes are automatically saved

## Getting Started

1. **Join a room**: Each room is a separate collaborative workspace
2. **Add files**: Use the "+" button to create new files
3. **Start editing**: Click on any file to start collaborative editing
4. **Share the room**: Share the room URL with your team

## File Types Supported

- TypeScript/JavaScript (`.ts`, `.js`)
- Python (`.py`)
- Markdown (`.md`)
- JSON (`.json`)
- CSS (`.css`)
- HTML (`.html`)
- And many more...

## Tips for Collaboration

- **Use descriptive file names**: Help your team understand the purpose
- **Add comments**: Document your code for better collaboration
- **Coordinate with your team**: Use the presence indicators to see who's working where

## Technical Details

This workspace uses:
- **Yjs**: Conflict-free replicated data types
- **Monaco Editor**: VS Code-like editing experience
- **WebSocket**: Real-time communication
- **React**: Modern UI framework

---

Happy collaborating! 🚀 