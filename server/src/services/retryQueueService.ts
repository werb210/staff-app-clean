export interface RetryJob {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  attempts: number;
  lastError?: string;
}

/**
 * Service simulating retry queue operations for failed background jobs.
 */
export class RetryQueueService {
  private readonly jobs: RetryJob[] = [];

  /**
   * Adds a job to the retry queue.
   */
  async enqueue(job: RetryJob): Promise<void> {
    this.jobs.push(job);
  }

  /**
   * Retrieves all jobs currently in the retry queue.
   */
  async list(): Promise<RetryJob[]> {
    return [...this.jobs];
  }

  /**
   * Removes a job from the queue by ID.
   */
  async remove(jobId: string): Promise<boolean> {
    const index = this.jobs.findIndex((job) => job.id === jobId);
    if (index === -1) {
      return false;
    }
    this.jobs.splice(index, 1);
    return true;
  }
}

export const retryQueueService = new RetryQueueService();
