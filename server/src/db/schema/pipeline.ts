// server/src/db/schema/pipeline.ts

export interface PipelineCard {
  id: string;
  applicationId: string;

  stage:
    | "New"
    | "Requires Docs"
    | "In Review"
    | "Docs Complete"
    | "Lender Review"
    | "Complete"
    | "Declined";

  assignedTo: string | null;  // staff user ID

  createdAt: Date;
  updatedAt: Date;
}
