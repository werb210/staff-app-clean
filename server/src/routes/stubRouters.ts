import { Router, Request, Response } from "express";

/**
 * Generates a stub router for a given base path and list of endpoints.
 * Each endpoint returns JSON confirming the stub works.
 */
export function createStubRouter(basePath: string, endpoints: { method: "get" | "post" | "put" | "delete"; path: string }[]) {
  const router = Router();

  endpoints.forEach(({ method, path }) => {
    router[method](path, (_req: Request, res: Response) => {
      res.json({ message: `Stub ${method.toUpperCase()} ${basePath}${path} OK` });
    });
  });

  return router;
}
