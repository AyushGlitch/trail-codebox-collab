import { useState, useEffect } from 'react';
import { Plus, FileText, X } from 'lucide-react';
import * as Y from 'yjs';
import { FileItem } from '../hooks/useYRoom';

interface Props {
  ydoc: Y.Doc;
  activeFileId: string;
  onFileSelect: (fileId: string) => void;
}

export default function FileManager({ ydoc, activeFileId, onFileSelect }: Props) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [newFileName, setNewFileName] = useState('');
  const [showAddFile, setShowAddFile] = useState(false);

  useEffect(() => {
    const fileList = ydoc.getArray<FileItem>('files');
    
    const updateFiles = () => {
      setFiles(fileList.toArray());
    };

    updateFiles();
    fileList.observe(updateFiles);

    return () => {
      fileList.unobserve(updateFiles);
    };
  }, [ydoc]);

  const addFile = () => {
    if (!newFileName.trim()) return;

    const fileList = ydoc.getArray<FileItem>('files');
    const fileId = newFileName.replace(/\s+/g, '-').toLowerCase();
    
    // Determine language from extension
    const getLanguage = (filename: string) => {
      const ext = filename.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'ts': case 'tsx': return 'typescript';
        case 'js': case 'jsx': return 'javascript';
        case 'py': return 'python';
        case 'md': return 'markdown';
        case 'json': return 'json';
        case 'css': return 'css';
        case 'html': return 'html';
        default: return 'plaintext';
      }
    };

    const newFile: FileItem = {
      id: fileId,
      name: newFileName,
      language: getLanguage(newFileName)
    };

    ydoc.transact(() => {
      fileList.push([newFile]);
      ydoc.getText(fileId).insert(0, `// ${newFileName}\n`);
    });

    setNewFileName('');
    setShowAddFile(false);
    onFileSelect(fileId);
  };

  const deleteFile = (fileId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const fileList = ydoc.getArray<FileItem>('files');
    const index = files.findIndex(f => f.id === fileId);
    
    if (index !== -1) {
      ydoc.transact(() => {
        fileList.delete(index, 1);
        // Note: Y.Text for the file remains in memory but won't be accessible
      });
      
      // Switch to first available file if we deleted the active one
      if (fileId === activeFileId && files.length > 1) {
        const remainingFiles = files.filter(f => f.id !== fileId);
        if (remainingFiles.length > 0) {
          onFileSelect(remainingFiles[0].id);
        }
      }
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Files</h2>
        <button
          onClick={() => setShowAddFile(!showAddFile)}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <Plus size={16} />
        </button>
      </div>

      {showAddFile && (
        <div className="mb-4">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="filename.ts"
            className="w-full p-2 bg-gray-800 rounded text-sm"
            onKeyPress={(e) => e.key === 'Enter' && addFile()}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={addFile}
              className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddFile(false)}
              className="px-3 py-1 bg-gray-600 rounded text-xs hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => onFileSelect(file.id)}
            className={`flex items-center justify-between p-2 rounded cursor-pointer group ${
              activeFileId === file.id ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span className="text-sm">{file.name}</span>
            </div>
            {files.length > 1 && (
              <button
                onClick={(e) => deleteFile(file.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 