export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  enabled: boolean;
}

/**
 * Service representing a simple cron scheduler used for background tasks.
 */
export class SchedulerService {
  private readonly tasks: ScheduledTask[] = [];

  /**
   * Registers a new scheduled task.
   */
  async registerTask(task: ScheduledTask): Promise<void> {
    this.tasks.push(task);
  }

  /**
   * Retrieves the list of registered tasks.
   */
  async listTasks(): Promise<ScheduledTask[]> {
    return [...this.tasks];
  }
}

export const schedulerService = new SchedulerService();
