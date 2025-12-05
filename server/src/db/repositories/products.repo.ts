export interface Product {
  id: string;
  name: string;
  category: string;
}

const products: Product[] = [
  { id: "loan", name: "Business Loan", category: "term-loan" },
  { id: "loc", name: "Line of Credit", category: "loc" }
];

export default {
  findMany: async (_filter?: any): Promise<Product[]> => {
    return products;
  }
};
