import crypto from "node:crypto";
import {
  applicationSummarySchema,
  completeApplicationSchema,
  createApplicationSchema,
  publicApplicationSchema,
  submitApplicationSchema
} from "../schemas/application.schema.js";
import type {
  ApplicationSummary,
  CompleteApplicationInput,
  CreateApplicationInput,
  PublicApplication,
  SubmitApplicationInput
} from "../schemas/application.schema.js";
import { documentRequirementSchema, documentUploadSchema } from "../schemas/document.schema.js";
import type { DocumentRequirement, DocumentUploadInput } from "../schemas/document.schema.js";
import { calculateChecksum } from "../utils/checksum.js";
import { isFeatureEnabled } from "../utils/featureFlags.js";

/**
 * Service encapsulating core application lifecycle operations.
 */
export class ApplicationService {
  /**
   * Creates a new application in draft state.
   */
  async createDraftApplication(payload: CreateApplicationInput): Promise<ApplicationSummary> {
    const validated = createApplicationSchema.parse(payload);
    const now = new Date().toISOString();
    return applicationSummarySchema.parse({
      id: crypto.randomUUID(),
      applicant: validated.applicant,
      loanDetails: validated.loanDetails,
      status: "draft",
      createdAt: now,
      updatedAt: now
    });
  }

  /**
   * Submits an existing application for review.
   */
  async submitApplication(payload: SubmitApplicationInput): Promise<ApplicationSummary> {
    const validated = submitApplicationSchema.parse(payload);

    if (!validated.declarationAccepted) {
      throw new Error("Declaration must be accepted before submitting an application");
    }

    const now = new Date().toISOString();
    return applicationSummarySchema.parse({
      id: validated.applicationId,
      applicant: {
        id: validated.submittedBy,
        firstName: "Pending",
        lastName: "Applicant",
        email: "pending@example.com",
        phone: "+10000000000"
      },
      loanDetails: {
        amountRequested: 10000,
        termMonths: 24,
        purpose: "General purpose",
        collateral: undefined
      },
      status: "submitted",
      createdAt: now,
      updatedAt: now
    });
  }

  /**
   * Uploads a supporting document for the specified application.
   */
  async uploadSupportingDocument(payload: DocumentUploadInput): Promise<DocumentRequirement> {
    const validated = documentUploadSchema.parse(payload);
    const checksum = calculateChecksum(validated.storageKey);
    return documentRequirementSchema.parse({
      id: crypto.randomUUID(),
      name: validated.fileName,
      description: `Uploaded document ${validated.fileName} (${validated.mimeType}) with checksum ${checksum.slice(0, 8)}`,
      required: true,
      status: "received"
    });
  }

  /**
   * Marks an application as completed.
   */
  async markApplicationComplete(payload: CompleteApplicationInput): Promise<ApplicationSummary> {
    const validated = completeApplicationSchema.parse(payload);
    const now = new Date().toISOString();
    return applicationSummarySchema.parse({
      id: validated.applicationId,
      applicant: {
        id: validated.completedBy,
        firstName: "Completed",
        lastName: "Applicant",
        email: "completed@example.com",
        phone: "+10000000000"
      },
      loanDetails: {
        amountRequested: 10000,
        termMonths: 36,
        purpose: validated.completionNotes ?? "Completed",
        collateral: undefined
      },
      status: "completed",
      createdAt: now,
      updatedAt: now
    });
  }

  /**
   * Returns applications that are available for public viewing.
   */
  async listPublicApplications(): Promise<PublicApplication[]> {
    const now = new Date().toISOString();
    const mockApplications: PublicApplication[] = [
      publicApplicationSchema.parse({
        id: crypto.randomUUID(),
        loanDetails: {
          amountRequested: 15000,
          termMonths: 18,
          purpose: "Equipment purchase",
          collateral: undefined
        },
        status: "submitted",
        createdAt: now
      })
    ];

    if (isFeatureEnabled("PUBLIC_APPLICATION_SAMPLE")) {
      mockApplications.push(
        publicApplicationSchema.parse({
          id: crypto.randomUUID(),
          loanDetails: {
            amountRequested: 25000,
            termMonths: 36,
            purpose: "Expansion capital",
            collateral: undefined
          },
          status: "under_review",
          createdAt: now
        })
      );
    }

    return mockApplications;
  }
}

export const applicationService = new ApplicationService();
