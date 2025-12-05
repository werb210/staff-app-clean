export interface Company {
  id: string;
  name: string;
  address?: string;
}

const companies: Company[] = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "Globex Ltd" },
];

const companiesRepo = {
  async findMany(_filter?: any): Promise<Company[]> {
    return companies;
  },
};

export default companiesRepo;
