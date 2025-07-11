import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useEffect, useMemo, useState } from 'react';
import { deduplicateFiles } from '../utils/deduplicate';
import { WorkspaceService } from '../services/workspaceService';

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

  // Initialize files from workspace folder (only once per room)
  useEffect(() => {
    if (!isConnected || !provider) return;

    const fileList = doc.getArray<FileItem>('files');
    
    // Use a timeout to ensure the document has fully synced
    const initTimeout = setTimeout(async () => {
      // First, remove any duplicate files that might exist
      deduplicateFiles(doc);
      
      // Double-check that files are still empty after sync and deduplication
      if (fileList.length === 0) {
        // Use a unique marker to prevent race conditions
        const initMarker = doc.getText('__init_marker__');
        
        if (initMarker.length === 0) {
          try {
            // Fetch workspace files from server
            const workspaceFiles = await WorkspaceService.getWorkspaceFiles();
            
            doc.transact(() => {
              // Set the marker first to prevent other clients from initializing
              initMarker.insert(0, 'initialized');
              
              // Add file metadata to the file list
              const fileItems: FileItem[] = workspaceFiles.map(file => ({
                id: file.id,
                name: file.name,
                language: file.language
              }));
              
              fileList.push(fileItems);
              
              // Initialize file contents from workspace
              workspaceFiles.forEach(file => {
                const yText = doc.getText(file.id);
                if (yText.length === 0) {
                  yText.insert(0, file.content);
                }
              });
            });
            
            console.log(`Initialized ${workspaceFiles.length} files from workspace`);
          } catch (error) {
            console.error('Failed to initialize workspace files:', error);
          }
        }
      }
    }, 100); // Small delay to allow for document synchronization

    return () => {
      clearTimeout(initTimeout);
    };
  }, [doc, isConnected, provider]);

  return { doc, provider, isConnected };
} 