import { productService } from "../services/productService.js";

export const productController = {
  list: async (_req, res) => {
    res.json(await productService.list());
  },

  get: async (req, res) => {
    res.json(await productService.get(req.params.id));
  },

  create: async (req, res) => {
    res.json(await productService.create(req.body));
  },

  update: async (req, res) => {
    res.json(await productService.update(req.params.id, req.body));
  },

  remove: async (req, res) => {
    res.json(await productService.remove(req.params.id));
  },
};
