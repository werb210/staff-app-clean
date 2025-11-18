import { applicationService } from "../services/applicationService.js";

export const applicationController = {
  list: async (_req, res) => {
    res.json(await applicationService.list());
  },

  get: async (req, res) => {
    res.json(await applicationService.get(req.params.id));
  },

  create: async (req, res) => {
    res.json(await applicationService.create(req.body));
  },

  update: async (req, res) => {
    res.json(await applicationService.update(req.params.id, req.body));
  },

  remove: async (req, res) => {
    res.json(await applicationService.remove(req.params.id));
  },
};
