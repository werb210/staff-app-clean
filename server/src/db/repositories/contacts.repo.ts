export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

const contacts: Contact[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Sarah Smith", phone: "555-0101" },
];

const contactsRepo = {
  // allow an optional filter object, but ignore it for now
  async findMany(_filter?: any): Promise<Contact[]> {
    return contacts;
  },
};

export default contactsRepo;
