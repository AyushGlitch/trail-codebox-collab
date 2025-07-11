import * as Y from 'yjs';
import { deduplicateFiles } from './deduplicate';
import { FileItem } from '../hooks/useYRoom';

// Simple test function
export function testDeduplication() {
  const doc = new Y.Doc();
  const fileList = doc.getArray<FileItem>('files');
  
  // Add some duplicate files
  fileList.push([
    { id: 'index.ts', name: 'index.ts', language: 'typescript' },
    { id: 'utils.ts', name: 'utils.ts', language: 'typescript' },
    { id: 'index.ts', name: 'index.ts', language: 'typescript' }, // duplicate
    { id: 'README.md', name: 'README.md', language: 'markdown' },
    { id: 'utils.ts', name: 'utils.ts', language: 'typescript' }, // duplicate
  ]);
  
  console.log('Before deduplication:', fileList.length, 'files');
  console.log('Files:', fileList.toArray().map(f => f.name));
  
  deduplicateFiles(doc);
  
  console.log('After deduplication:', fileList.length, 'files');
  console.log('Files:', fileList.toArray().map(f => f.name));
  
  return fileList.length === 3; // Should have 3 unique files
}

// Uncomment to run test
// console.log('Deduplication test passed:', testDeduplication()); 