import { randomUUID } from "crypto";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tasks: Task[] = [];

function matchesFilter(row: Task, filter?: any) {
  if (!filter) return true;
  return Object.entries(filter).every(([k, v]) => {
    if (typeof v === "string")
      return row[k]?.toString().toLowerCase().includes(v.toLowerCase());
    return row[k] === v;
  });
}

export default {
  async findMany(filter?: any): Promise<Task[]> {
    return tasks.filter(t => matchesFilter(t, filter));
  },

  async findById(id: string): Promise<Task | null> {
    return tasks.find(t => t.id === id) || null;
  },

  async create(data: any): Promise<Task> {
    const row: Task = {
      id: randomUUID(),
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tasks.push(row);
    return row;
  },

  async update(id: string, data: any): Promise<Task | null> {
    const row = tasks.find(t => t.id === id);
    if (!row) return null;

    Object.assign(row, data, { updatedAt: new Date() });
    return row;
  },

  async delete(id: string): Promise<{ id: string } | null> {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;

    tasks.splice(idx, 1);
    return { id };
  }
};
