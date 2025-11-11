import { randomUUID } from "crypto";
import {
  Lender,
  LenderProduct,
  LenderReport,
} from "../schemas/lenderProduct.schema.js";

/**
 * LenderService provides an in-memory catalogue of lenders and products.
 */
class LenderService {
  private readonly lenders: Lender[] = [
    {
      id: "a0e2711b-4bb5-4ba0-94f5-cc5f25152f1f",
      name: "Northwind Credit",
      contactEmail: "sales@northwind.example",
    },
    {
      id: "4a67f0d4-571e-4be7-9a3a-5a846e91ec3c",
      name: "Evergreen Bank",
      contactEmail: "partners@evergreen.example",
    },
  ];

  private readonly products: LenderProduct[] = [
    {
      id: "385ca198-5b56-4587-a5b4-947ca9b61930",
      lenderId: "a0e2711b-4bb5-4ba0-94f5-cc5f25152f1f",
      name: "Small Business Term Loan",
      rate: 6.25,
    },
    {
      id: "9ce2637f-2255-4790-8eb7-50f572cca40a",
      lenderId: "4a67f0d4-571e-4be7-9a3a-5a846e91ec3c",
      name: "Commercial Mortgage",
      rate: 7.1,
    },
  ];

  /**
   * Returns the list of configured lenders.
   */
  public listLenders(): Lender[] {
    return [...this.lenders];
  }

  /**
   * Returns the products for a lender.
   */
  public listProducts(lenderId: string): LenderProduct[] {
    return this.products.filter((product) => product.lenderId === lenderId);
  }

  /**
   * Simulates sending an application package to a lender.
   */
  public sendToLender(applicationId: string, lenderId: string): LenderReport {
    return {
      id: randomUUID(),
      lenderId,
      applicationId,
      status: "queued",
      sentAt: new Date().toISOString(),
    };
  }

  /**
   * Produces a synthetic report summarising lender product counts.
   */
  public generateReports(): LenderReport[] {
    return this.lenders.map((lender) => ({
      id: randomUUID(),
      lenderId: lender.id,
      applicationId: "00000000-0000-0000-0000-000000000000",
      status: "summary",
      sentAt: new Date().toISOString(),
      products: this.listProducts(lender.id).length,
    }));
  }
}

export const lenderService = new LenderService();

export type LenderServiceType = LenderService;
