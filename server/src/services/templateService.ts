import { randomUUID } from "crypto";

export type TemplateType = "sms" | "email";

export interface MessageTemplate {
  id: string;
  name: string;
  type: TemplateType;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateTemplateInput {
  name: string;
  type: TemplateType;
  content: string;
  createdBy?: string;
}

export interface UpdateTemplateInput {
  name?: string;
  type?: TemplateType;
  content?: string;
  updatedBy?: string;
}

const templates: MessageTemplate[] = [
  {
    id: "2a2f72f7-6309-4e9f-ae36-f4a074b5c9f2",
    name: "Loan Approval",
    type: "email",
    content:
      "<p>Hello {{firstName}},</p><p>Your loan application has been approved. Next steps will follow shortly.</p>",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ad9f0e4f-8d6f-4d2e-8d2f-9f3f6d3a1e7b",
    name: "Document Request",
    type: "sms",
    content: "Hi {{firstName}}, please upload the latest financial statements to your portal.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class TemplateNotFoundError extends Error {
  constructor(id: string) {
    super(`Template ${id} not found`);
    this.name = "TemplateNotFoundError";
  }
}

export const getTemplates = async (): Promise<MessageTemplate[]> =>
  templates
    .map((template) => ({ ...template }))
    .sort((a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf());

export const createTemplate = async (
  input: CreateTemplateInput,
): Promise<MessageTemplate> => {
  const timestamp = new Date().toISOString();
  const template: MessageTemplate = {
    id: randomUUID(),
    name: input.name,
    type: input.type,
    content: input.content,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: input.createdBy,
  };

  templates.unshift(template);
  return { ...template };
};

export const updateTemplate = async (
  id: string,
  input: UpdateTemplateInput,
): Promise<MessageTemplate> => {
  const index = templates.findIndex((template) => template.id === id);
  if (index === -1) {
    throw new TemplateNotFoundError(id);
  }

  const timestamp = new Date().toISOString();
  const existing = templates[index];
  const updated: MessageTemplate = {
    ...existing,
    ...input,
    updatedAt: timestamp,
    updatedBy: input.updatedBy,
  };

  templates[index] = updated;
  return { ...updated };
};

export const deleteTemplate = async (id: string): Promise<void> => {
  const index = templates.findIndex((template) => template.id === id);
  if (index === -1) {
    throw new TemplateNotFoundError(id);
  }

  templates.splice(index, 1);
};
