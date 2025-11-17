// server/src/db/schema/users.ts

export type UserRole =
  | "admin"
  | "staff"
  | "lender"
  | "referrer"
  | "marketing"
  | "superadmin";

export interface User {
  id: string;

  email: string;
  passwordHash: string;

  firstName: string;
  lastName: string;

  role: UserRole;

  // Lender portal link
  lenderId: string | null;

  // Referrer tracking
  referrerCode: string | null;

  createdAt: Date;
  updatedAt: Date;
}
