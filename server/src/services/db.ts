import { randomUUID } from "crypto";

import type {
  ApplicationRecord,
  DocumentRecord,
  PipelineRecord,
  Silo,
  User,
} from "../types/index.js";

export type { ApplicationRecord, DocumentRecord, PipelineRecord, Silo } from "../types/index.js";

export interface LenderRecord {
  id: string;
  silo: Silo;
  name: string;
  products?: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationRecord {
  id: string;
  silo: Silo;
  appId?: string;
  contactId?: string;
  direction: "inbound" | "outbound";
  type: "sms" | "call" | "email";
  message?: string;
  meta?: unknown;
  createdAt: Date;
}

export interface NotificationRecord {
  id: string;
  silo: Silo;
  appId?: string;
  type: string;
  payload?: unknown;
  createdAt: Date;
}

export interface Table<T> {
  data: T[];
}

export interface AuditLogRecord {
  id: string;
  userId: string | null;
  message: string;
  silo: Silo;
  createdAt: string;
}

export interface UserRecord extends User {
  createdAt: string;
}

export type CreateUserData = Omit<UserRecord, "id" | "createdAt">;

export type UpdateUserData = Partial<Omit<UserRecord, "id" | "createdAt">>;

class InMemoryDB {
  applications: Record<Silo, Table<ApplicationRecord>> = {
    BF: { data: [] },
    BI: { data: [] },
    SLF: { data: [] },
  };

  documents: Record<Silo, Table<DocumentRecord>> = {
    BF: { data: [] },
    BI: { data: [] },
    SLF: { data: [] },
  };

  lenders: Record<Silo, Table<LenderRecord>> = {
    BF: { data: [] },
    BI: { data: [] },
    SLF: { data: [] },
  };

  products: Record<Silo, Table<unknown>> = {
    BF: { data: [] },
    BI: { data: [] },
    SLF: { data: [] },
  };

  pipeline: Record<Silo, Table<PipelineRecord>> = {
    BF: { data: [] },
    BI: { data: [] },
    SLF: { data: [] },
  };

  communications: Record<Silo, Table<CommunicationRecord>> = {
    BF: { data: [] },
    BI: { data: [] },
    SLF: { data: [] },
  };

  notifications: Record<Silo, Table<NotificationRecord>> = {
    BF: { data: [] },
    BI: { data: [] },
    SLF: { data: [] },
  };

  users: Table<UserRecord> = { data: [] };

  auditLogs: AuditLogRecord[] = [];

  id(): string {
    return randomUUID();
  }
}

export const db = new InMemoryDB();
