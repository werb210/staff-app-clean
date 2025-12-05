export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

const contacts: Contact[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Sarah Smith", phone: "555-0101" }
];

export default {
  findMany: async (_filter?: any): Promise<Contact[]> => {
    return contacts;
  }
};
