// server/src/db/schema/applications.ts

export interface Application {
  id: string;

  // Applicant info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Business info
  businessName: string;
  businessLegalName: string;
  industry: string;
  businessLocation: string;
  yearsInBusiness: number;

  // Financial profile
  amountRequested: number;
  avgMonthlyRevenue: number;
  revenueLast12m: number;
  arBalance: number;
  apBalance: number;
  collateralValue: number;

  // Purpose
  fundsPurpose: string;

  // App status
  status: "submitted" | "in_review" | "requires_docs" | "docs_received" | "lender_review" | "approved" | "declined";

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
