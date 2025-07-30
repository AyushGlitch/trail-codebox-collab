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
      return [];
    }
  }
} 