import { randomUUID } from "crypto";

/**
 * -----------------------------------------------------
 * SILO TYPES
 * -----------------------------------------------------
 */
export type Silo = "BF" | "BI" | "SLF";

/**
 * -----------------------------------------------------
 * APPLICATION RECORD
 * -----------------------------------------------------
 */
export interface ApplicationRecord {
  id: string;
  silo: Silo;
  userId?: string | null;

  // dynamic application fields
  [key: string]: any;

  createdAt: string;
  updatedAt: string;
}

/**
 * -----------------------------------------------------
 * DOCUMENT RECORD
 * -----------------------------------------------------
 */
export interface DocumentRecord {
  id: string;
  appId: string;
  silo: Silo;
  name: string;
  category?: string | null;
  mimeType?: string | null;
  checksum?: string | null;
  sizeBytes?: number | null;

  // For local testing buffer may exist
  buffer?: Buffer;

  createdAt: string;
  updatedAt: string;

  accepted?: boolean;
  acceptedBy?: string | null;
  rejected?: boolean;
  rejectedBy?: string | null;
}

/**
 * -----------------------------------------------------
 * LENDER RECORD
 * -----------------------------------------------------
 */
export interface LenderRecord {
  id: string;
  silo: Silo;
  name: string;
  products?: any[];

  createdAt: string;
  updatedAt: string;
}

/**
 * -----------------------------------------------------
 * PIPELINE RECORD
 * -----------------------------------------------------
 */
export interface PipelineRecord {
  id: string;
  silo: Silo;
  appId: string;
  stage: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * -----------------------------------------------------
 * COMMUNICATION RECORD
 * -----------------------------------------------------
 */
export interface CommunicationRecord {
  id: string;
  silo: Silo;
  appId?: string;
  contactId?: string;
  direction: "inbound" | "outbound";
  type: "sms" | "call" | "email";

  message?: string;
  meta?: any;

  createdAt: string;
}

/**
 * -----------------------------------------------------
 * NOTIFICATION RECORD
 * -----------------------------------------------------
 */
export interface NotificationRecord {
  id: string;
  silo: Silo;
  appId?: string;
  type: string;
  payload?: any;

  createdAt: string;
}

/**
 * -----------------------------------------------------
 * GENERIC TABLE
 * -----------------------------------------------------
 */
interface Table<T> {
  data: T[];
}

/**
 * -----------------------------------------------------
 * IN-MEMORY DATABASE
 * -----------------------------------------------------
 */
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

  products: Record<Silo, Table<any>> = {
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

  // user table not silo-specific
  users: Table<any> = { data: [] };

  // audit log always global
  auditLogs: any[] = [];

  id() {
    return randomUUID();
  }
}

export const db = new InMemoryDB();
