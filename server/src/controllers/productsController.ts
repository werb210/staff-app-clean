truncate -s 0 server/src/controllers/productsController.ts

cat > server/src/controllers/productsController.ts << 'EOF'
// server/src/controllers/productsController.ts
import type { Request, Response } from "express";

// After removing Drizzle, this controller is temporarily disabled.
export const productController = {
  async list(_req: Request, res: Response) {
    res.status(501).json({ ok: false, error: "Products not implemented." });
  },

  async get(_req: Request, res: Response) {
    res.status(501).json({ ok: false, error: "Products not implemented." });
  },

  async create(_req: Request, res: Response) {
    res.status(501).json({ ok: false, error: "Products not implemented." });
  },

  async update(_req: Request, res: Response) {
    res.status(501).json({ ok: false, error: "Products not implemented." });
  },

  async remove(_req: Request, res: Response) {
    res.status(501).json({ ok: false, error: "Products not implemented." });
  },
};
EOF
