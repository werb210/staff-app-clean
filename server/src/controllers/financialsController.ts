import {
  getAllFinancials,
  getFinancialsById,
  createFinancials,
  updateFinancials,
  deleteFinancials
} from "../services/financialsService.js";

async function list(_req, res) {
  try {
    const data = await getAllFinancials();
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function get(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    const data = await getFinancialsById(id);

    if (!data) {
      return res.status(404).json({ error: "Financials not found" });
    }

    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const data = await createFinancials(req.body);
    return res.status(201).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    const data = await updateFinancials(id, req.body);

    if (!data) {
      return res.status(404).json({ error: "Financials not found" });
    }

    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    await deleteFinancials(id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export const financialsController = {
  list,
  get,
  create,
  update,
  remove
};

export default financialsController;
