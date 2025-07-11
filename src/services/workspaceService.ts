import { FileItem } from '../hooks/useYRoom';

export interface WorkspaceFile extends FileItem {
  content: string;
}

export class WorkspaceService {
  private static baseUrl = 'http://localhost:1234';

  static async getWorkspaceFiles(): Promise<WorkspaceFile[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/workspace`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch workspace files: ${response.statusText}`);
      }
      
      const files: WorkspaceFile[] = await response.json();
      return files;
    } catch (error) {
      console.error('Error fetching workspace files:', error);
      // Return default files if server is not available
      return this.getDefaultFiles();
    }
  }

  private static getDefaultFiles(): WorkspaceFile[] {
    return [
      {
        id: 'index.ts',
        name: 'index.ts',
        language: 'typescript',
        content: '// Welcome to collaborative editing!\nconsole.log("Hello, world!");'
      },
      {
        id: 'utils.ts',
        name: 'utils.ts',
        language: 'typescript',
        content: '// Utility functions\nexport function helper() {\n  return "Hello from utils!";\n}'
      },
      {
        id: 'README.md',
        name: 'README.md',
        language: 'markdown',
        content: '# Collaborative Editor\n\nEdit this file with your team!'
      }
    ];
  }
} 