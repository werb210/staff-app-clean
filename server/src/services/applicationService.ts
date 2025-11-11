import { randomUUID } from "crypto";
import {
  Application,
  ApplicationCreateInput,
  ApplicationStatus,
} from "../schemas/application.schema.js";
import { PipelineStage } from "../schemas/pipeline.schema.js";

/**
 * ApplicationService stores applications in memory to simulate a database.
 */
class ApplicationService {
  private readonly applications = new Map<string, Application>();

  constructor() {
    const seed: Application = {
      id: "c27e0c87-3bd5-47cc-8d14-5c569ea2cc15",
      applicantName: "Jane Doe",
      productId: "0d1bd95e-08b5-46b3-8df8-17f29cc3fc49",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.applications.set(seed.id, seed);
  }

  /**
   * Returns all applications.
   */
  public listApplications(): Application[] {
    return Array.from(this.applications.values());
  }

  /**
   * Fetches an application by identifier or returns a placeholder entry.
   */
  public getApplication(id: string): Application {
    const existing = this.applications.get(id);
    if (existing) {
      return existing;
    }

    const placeholder: Application = {
      id,
      applicantName: "Unknown Applicant",
      productId: "00000000-0000-0000-0000-000000000000",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.applications.set(id, placeholder);
    return placeholder;
  }

  /**
   * Creates a new application from the supplied payload.
   */
  public createApplication(payload: ApplicationCreateInput): Application {
    const id = randomUUID();
    const now = new Date().toISOString();
    const application: Application = {
      id,
      applicantName: payload.applicantName,
      productId: payload.productId,
      status: payload.status ?? "draft",
      createdAt: now,
      updatedAt: now,
    };
    this.applications.set(id, application);
    return application;
  }

  /**
   * Updates an application's status.
   */
  public updateStatus(id: string, status: ApplicationStatus): Application {
    const application = this.getApplication(id);
    const updated: Application = { ...application, status, updatedAt: new Date().toISOString() };
    this.applications.set(id, updated);
    return updated;
  }

  /**
   * Marks an application as submitted by changing its status.
   */
  public submitApplication(id: string, submittedBy: string): Application {
    const application = this.updateStatus(id, "submitted");
    return { ...application, submittedBy } as Application & { submittedBy: string };
  }

  /**
   * Marks an application as completed.
   */
  public completeApplication(id: string, completedBy: string): Application {
    const application = this.updateStatus(id, "completed");
    return { ...application, completedBy } as Application & { completedBy: string };
  }

  /**
   * Builds a pipeline summary based on the applications in memory.
   */
  public buildPipeline(): PipelineStage[] {
    const grouped = new Map<ApplicationStatus, Application[]>();
    for (const application of this.applications.values()) {
      const list = grouped.get(application.status) ?? [];
      list.push(application);
      grouped.set(application.status, list);
    }

    const stages: PipelineStage[] = [];
    for (const [status, apps] of grouped.entries()) {
      stages.push({
        id: randomUUID(),
        name: status,
        status,
        count: apps.length,
      });
    }
    return stages;
  }
}

export const applicationService = new ApplicationService();

export type ApplicationServiceType = ApplicationService;
