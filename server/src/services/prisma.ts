import { db } from "../db.js";
import type {
  AuditLogRecord,
  CreateUserData,
  UpdateUserData,
  UserRecord,
} from "./db.js";
import type { Silo } from "../types/index.js";

export type { Silo } from "../types/index.js";

export type UserContext = { id?: string; silos: Silo[] };

export class SiloAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SiloAccessError";
  }
}

export function requireUserSiloAccess(userSilos: Silo[], targetSilo: Silo) {
  if (!userSilos.includes(targetSilo)) {
    throw new SiloAccessError(
      `User is not authorized to access silo ${targetSilo}`
    );
  }
}

export const prisma = {
  auditLog: {
    async create({ data }: { data: Omit<AuditLogRecord, "id" | "createdAt"> }) {
      const record: AuditLogRecord = {
        id: db.id(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      db.auditLogs.push(record);
      return record;
    },
  },
  user: {
    async create({ data }: { data: CreateUserData }): Promise<UserRecord> {
      const record: UserRecord = {
        id: db.id(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      db.users.data.push(record);
      return record;
    },
    async findUnique({ where }: { where: { id: string } }): Promise<UserRecord | null> {
      return db.users.data.find((u) => u.id === where.id) ?? null;
    },
    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: UpdateUserData;
    }): Promise<UserRecord> {
      const idx = db.users.data.findIndex((u) => u.id === where.id);
      if (idx === -1) throw new Error("User not found");
      db.users.data[idx] = { ...db.users.data[idx], ...data };
      return db.users.data[idx];
    },
  },
};
