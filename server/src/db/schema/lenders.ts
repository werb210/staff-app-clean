// server/src/db/schema/lenders.ts

export interface Lender {
  id: string;
  name: string;
  country: "CA" | "US";
  active: boolean;

  minAmount: number;
  maxAmount: number;
  minYearsInBusiness: number;
  productTypes: string[];

  createdAt: Date;
  updatedAt: Date;
}
