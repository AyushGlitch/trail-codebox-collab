import * as Y from 'yjs';
import { FileItem } from '../hooks/useYRoom';

export function deduplicateFiles(doc: Y.Doc): void {
  const fileList = doc.getArray<FileItem>('files');
  const files = fileList.toArray();
  
  // Find duplicates by ID
  const seenIds = new Set<string>();
  const indicesToRemove: number[] = [];
  
  files.forEach((file, index) => {
    if (seenIds.has(file.id)) {
      indicesToRemove.push(index);
    } else {
      seenIds.add(file.id);
    }
  });
  
  // Remove duplicates (in reverse order to maintain indices)
  if (indicesToRemove.length > 0) {
    doc.transact(() => {
      indicesToRemove.reverse().forEach(index => {
        fileList.delete(index, 1);
      });
    });
    
    console.log(`Removed ${indicesToRemove.length} duplicate files`);
  }
} 