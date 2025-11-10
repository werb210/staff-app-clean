export interface BackupSummary {
  id: string;
  createdAt: string;
  status: "pending" | "completed" | "failed";
  sizeBytes: number;
}

/**
 * Service that simulates backup creation and listing for administrative tooling.
 */
export class BackupService {
  private readonly backups: BackupSummary[] = [];

  /**
   * Creates a new backup entry.
   */
  async createBackup(): Promise<BackupSummary> {
    const backup: BackupSummary = {
      id: `backup-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "completed",
      sizeBytes: 10 * 1024 * 1024
    };
    this.backups.push(backup);
    return backup;
  }

  /**
   * Lists previously generated backups.
   */
  async listBackups(): Promise<BackupSummary[]> {
    return [...this.backups];
  }
}

export const backupService = new BackupService();
