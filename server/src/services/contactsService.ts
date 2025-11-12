import { randomUUID } from "crypto";
import {
  ContactCreateSchema,
  ContactSchema,
  ContactUpdateSchema,
  type Contact,
  type ContactCreateInput,
  type ContactUpdateInput,
  TimelineEventSchema,
  type TimelineEvent,
  type TimelineEventType,
} from "../schemas/contact.schema.js";

export class ContactNotFoundError extends Error {
  constructor(id: string) {
    super(`Contact ${id} not found`);
    this.name = "ContactNotFoundError";
  }
}

export class ContactConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContactConflictError";
  }
}

export interface TimelineSeed {
  id?: string;
  type: TimelineEventType;
  message: string;
  createdAt?: string;
}

export interface ContactSeed extends ContactCreateInput {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  timeline?: TimelineSeed[];
}

export interface ContactsServiceOptions {
  seedContacts?: ContactSeed[];
}

export class ContactsService {
  private readonly contacts = new Map<string, Contact>();
  private readonly timelines = new Map<string, TimelineEvent[]>();

  constructor(options: ContactsServiceOptions = {}) {
    const seeds = options.seedContacts ?? [];
    seeds.forEach((seed) => this.seedContact(seed));
  }

  private seedContact(seed: ContactSeed): void {
    const now = new Date();
    const id = seed.id ?? randomUUID();
    const createdAt = seed.createdAt ?? now.toISOString();
    const updatedAt = seed.updatedAt ?? createdAt;

    const contact = ContactSchema.parse({
      id,
      firstName: seed.firstName,
      lastName: seed.lastName,
      email: seed.email,
      phone: seed.phone,
      companyName: seed.companyName,
      createdAt,
      updatedAt,
    });

    this.contacts.set(contact.id, contact);

    const events = seed.timeline?.map((event) =>
      TimelineEventSchema.parse({
        id: event.id ?? randomUUID(),
        contactId: contact.id,
        type: event.type,
        message: event.message,
        createdAt: event.createdAt ?? new Date().toISOString(),
      }),
    );

    this.timelines.set(contact.id, this.sortTimeline(events ?? []));
  }

  private sortTimeline(events: TimelineEvent[]): TimelineEvent[] {
    return [...events].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  private requireContact(id: string): Contact {
    const contact = this.contacts.get(id);
    if (!contact) {
      throw new ContactNotFoundError(id);
    }
    return contact;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private assertUniqueEmail(email: string, skipId?: string): void {
    const normalized = this.normalizeEmail(email);
    for (const contact of this.contacts.values()) {
      if (skipId && contact.id === skipId) {
        continue;
      }
      if (this.normalizeEmail(contact.email) === normalized) {
        throw new ContactConflictError("A contact with this email already exists");
      }
    }
  }

  public getAllContacts(): Contact[] {
    return Array.from(this.contacts.values())
      .map((contact) => ({ ...contact }))
      .sort((a, b) => {
        const last = a.lastName.localeCompare(b.lastName);
        return last !== 0 ? last : a.firstName.localeCompare(b.firstName);
      });
  }

  public createContact(data: ContactCreateInput): Contact {
    const payload = ContactCreateSchema.parse(data);
    this.assertUniqueEmail(payload.email);

    const now = new Date().toISOString();
    const contact = ContactSchema.parse({
      id: randomUUID(),
      ...payload,
      createdAt: now,
      updatedAt: now,
    });

    this.contacts.set(contact.id, contact);
    this.timelines.set(contact.id, []);
    return { ...contact };
  }

  public getContact(id: string): Contact {
    const contact = this.requireContact(id);
    return { ...contact };
  }

  public updateContact(id: string, data: ContactUpdateInput): Contact {
    const existing = this.requireContact(id);
    const payload = ContactUpdateSchema.parse(data);

    if (payload.email && this.normalizeEmail(payload.email) !== this.normalizeEmail(existing.email)) {
      this.assertUniqueEmail(payload.email, id);
    }

    const updated = ContactSchema.parse({
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
    });

    this.contacts.set(id, updated);
    return { ...updated };
  }

  public deleteContact(id: string): void {
    if (!this.contacts.delete(id)) {
      throw new ContactNotFoundError(id);
    }
    this.timelines.delete(id);
  }

  public getTimeline(contactId: string): TimelineEvent[] {
    this.requireContact(contactId);
    const events = this.timelines.get(contactId) ?? [];
    return this.sortTimeline(events).map((event) => ({ ...event }));
  }
}

export type ContactsServiceType = ContactsService;

export const createContactsService = (seedContacts?: ContactSeed[]): ContactsService =>
  new ContactsService({ seedContacts });
