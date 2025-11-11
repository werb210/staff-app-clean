import { randomUUID } from "crypto";

export interface BackupRecord {
  id: string;
  name: string;
  status: "pending" | "completed";
  createdAt: string;
}

/**
 * BackupService keeps track of database backup metadata.
 */
class BackupService {
  private readonly backups: BackupRecord[] = [
    {
      id: "cde27026-349d-4e71-b3af-09b587971776",
      name: "nightly-1",
      status: "completed",
      createdAt: new Date().toISOString(),
    },
  ];

  /**
   * Returns the recorded backups.
   */
  public listBackups(): BackupRecord[] {
    return [...this.backups];
  }

  /**
   * Records a new backup entry.
   */
  public createBackup(name: string): BackupRecord {
    const backup: BackupRecord = {
      id: randomUUID(),
      name,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.backups.unshift(backup);
    return backup;
  }
}

export const backupService = new BackupService();

export type BackupServiceType = BackupService;
