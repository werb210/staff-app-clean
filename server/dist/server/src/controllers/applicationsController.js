import { applicationService } from "../services/applicationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const applicationsController = {
  all: asyncHandler(async (_req, res) => {
    const rows = await applicationService.all();
    res.json({ ok: true, data: rows });
  }),

  get: asyncHandler(async (req, res) => {
    const row = await applicationService.get(req.params.id);
    if (!row) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }
    res.json({ ok: true, data: row });
  }),
};
