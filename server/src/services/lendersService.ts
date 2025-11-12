import { randomUUID } from "crypto";

export interface LenderProductRecord {
  id: string;
  name: string;
  country: string;
  minAmount: number;
  maxAmount: number;
  productType: string;
  interestRate: number;
  requirements: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const lenderProducts = new Map<string, LenderProductRecord>();

const seedProducts: Omit<LenderProductRecord, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Northwind Working Capital",
    country: "US",
    minAmount: 25000,
    maxAmount: 250000,
    productType: "term-loan",
    interestRate: 6.5,
    requirements: {
      documents: ["bank-statements", "tax-returns"],
      creditScore: 680,
    },
  },
  {
    name: "Evergreen Growth Line",
    country: "CA",
    minAmount: 50000,
    maxAmount: 500000,
    productType: "line-of-credit",
    interestRate: 5.9,
    requirements: {
      documents: ["financial-statements"],
      collateral: "inventory",
    },
  },
];

const ensureSeeds = () => {
  if (lenderProducts.size > 0) {
    return;
  }
  const now = new Date().toISOString();
  seedProducts.forEach((seed) => {
    const id = randomUUID();
    lenderProducts.set(id, {
      id,
      createdAt: now,
      updatedAt: now,
      ...seed,
    });
  });
};

ensureSeeds();

export interface LenderProductInput {
  name: string;
  country: string;
  minAmount: number;
  maxAmount: number;
  productType: string;
  interestRate: number;
  requirements?: Record<string, unknown>;
}

export const getAll = (): LenderProductRecord[] =>
  Array.from(lenderProducts.values());

export const create = (data: LenderProductInput): LenderProductRecord => {
  const id = randomUUID();
  const now = new Date().toISOString();
  const record: LenderProductRecord = {
    id,
    name: data.name,
    country: data.country,
    minAmount: data.minAmount,
    maxAmount: data.maxAmount,
    productType: data.productType,
    interestRate: data.interestRate,
    requirements: data.requirements ?? {},
    createdAt: now,
    updatedAt: now,
  };
  lenderProducts.set(id, record);
  return record;
};

export const update = (
  id: string,
  data: Partial<LenderProductInput>,
): LenderProductRecord => {
  const existing = lenderProducts.get(id);
  if (!existing) {
    throw new Error("Lender not found");
  }
  const updated: LenderProductRecord = {
    ...existing,
    ...data,
    requirements: data.requirements ?? existing.requirements,
    updatedAt: new Date().toISOString(),
  };
  lenderProducts.set(id, updated);
  return updated;
};

export const remove = (id: string): void => {
  if (!lenderProducts.delete(id)) {
    throw new Error("Lender not found");
  }
};

// Legacy class export for compatibility with placeholder tooling.
export class LenderService {
  public listLenders(): LenderProductRecord[] {
    return getAll();
  }

  public createLender(data: LenderProductInput): LenderProductRecord {
    return create(data);
  }

  public updateLender(id: string, data: Partial<LenderProductInput>): LenderProductRecord {
    return update(id, data);
  }

  public deleteLender(id: string): void {
    remove(id);
  }

  public listProducts(): LenderProductRecord[] {
    return getAll();
  }
}

export const createLenderService = (_options: unknown = {}) => new LenderService();

export const lenderService = new LenderService();
