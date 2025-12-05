export interface Company {
  id: string;
  name: string;
  address?: string;
}

const companies: Company[] = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "Globex Ltd" }
];

export default {
  findMany: async (_filter?: any): Promise<Company[]> => {
    return companies;
  }
};
