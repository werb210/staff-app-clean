export interface User {
  id: string;
  email: string;
  name?: string;          // optional — DB does not require it
  role: string;
  silos: Silo[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  silos: Silo[];
}

export interface StoredUser extends User {
  passwordHash: string;
}

export interface Silo {
  id: string;
  name: string;
}
