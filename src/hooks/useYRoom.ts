import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useEffect, useMemo, useState } from 'react';
import { deduplicateFiles } from '../utils/deduplicate';

export interface FileItem {
  id: string;
  name: string;
  language: string;
}

export function useYRoom(roomId: string) {
  const [isConnected, setIsConnected] = useState(false);
  
  const doc = useMemo(() => new Y.Doc(), [roomId]);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    const wsProvider = new WebsocketProvider('ws://localhost:1234', roomId, doc);
    
    wsProvider.on('status', (event: { status: string }) => {
      setIsConnected(event.status === 'connected');
    });

    // Set user info for awareness
    wsProvider.awareness.setLocalStateField('user', {
      name: `User-${Math.floor(Math.random() * 1000)}`,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    });

    setProvider(wsProvider);

    return () => {
      wsProvider.destroy();
    };
  }, [doc, roomId]);

  // Initialize default files if empty (only once per room)
  useEffect(() => {
    if (!isConnected || !provider) return;

    const fileList = doc.getArray<FileItem>('files');
    
    // Use a timeout to ensure the document has fully synced
    const initTimeout = setTimeout(() => {
      // First, remove any duplicate files that might exist
      deduplicateFiles(doc);
      
      // Double-check that files are still empty after sync and deduplication
      if (fileList.length === 0) {
        // Use a unique marker to prevent race conditions
        const initMarker = doc.getText('__init_marker__');
        
        if (initMarker.length === 0) {
          doc.transact(() => {
            // Set the marker first to prevent other clients from initializing
            initMarker.insert(0, 'initialized');
            
            fileList.push([
              { id: 'index.ts', name: 'index.ts', language: 'typescript' },
              { id: 'utils.ts', name: 'utils.ts', language: 'typescript' },
              { id: 'README.md', name: 'README.md', language: 'markdown' }
            ]);
            
            // Initialize file contents only if they're empty
            const indexText = doc.getText('index.ts');
            const utilsText = doc.getText('utils.ts');
            const readmeText = doc.getText('README.md');
            
            if (indexText.length === 0) {
              indexText.insert(0, '// Welcome to collaborative editing!\nconsole.log("Hello, world!");');
            }
            if (utilsText.length === 0) {
              utilsText.insert(0, '// Utility functions\nexport function helper() {\n  return "Hello from utils!";\n}');
            }
            if (readmeText.length === 0) {
              readmeText.insert(0, '# Collaborative Editor\n\nEdit this file with your team!');
            }
          });
        }
      }
    }, 100); // Small delay to allow for document synchronization

    return () => {
      clearTimeout(initTimeout);
    };
  }, [doc, isConnected, provider]);

  return { doc, provider, isConnected };
} 