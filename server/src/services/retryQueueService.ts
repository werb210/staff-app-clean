import { randomUUID } from "crypto";

export interface RetryJob {
  id: string;
  name: string;
  status: "queued" | "retrying" | "failed" | "completed";
  attempts: number;
  updatedAt: string;
}

/**
 * RetryQueueService keeps a list of retryable jobs for admin tooling.
 */
class RetryQueueService {
  private readonly jobs = new Map<string, RetryJob>();

  constructor() {
    const seed: RetryJob = {
      id: "6c5cb751-a9a4-49d2-91af-65f110df707b",
      name: "sync-application",
      status: "failed",
      attempts: 2,
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(seed.id, seed);
  }

  /**
   * Lists jobs currently stored in the retry queue.
   */
  public listJobs(): RetryJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Enqueues a new retry job.
   */
  public enqueueJob(name: string): RetryJob {
    const job: RetryJob = {
      id: randomUUID(),
      name,
      status: "queued",
      attempts: 0,
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(job.id, job);
    return job;
  }

  /**
   * Marks a job for retry by bumping its attempt count.
   */
  public retryJob(id: string): RetryJob {
    const job = this.jobs.get(id) ?? this.enqueueJob("unknown-job");
    const updated: RetryJob = {
      ...job,
      status: "retrying",
      attempts: job.attempts + 1,
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(updated.id, updated);
    return updated;
  }
}

export const retryQueueService = new RetryQueueService();

export type RetryQueueServiceType = RetryQueueService;
