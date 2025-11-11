import { Router } from "express";
import { UserSchema } from "../schemas/user.schema.js";

const router = Router();

// Echo endpoint that validates the provided user payload.
router.post("/", (req, res) => {
  const user = UserSchema.parse(req.body);
  res.status(201).json({ message: "OK", data: user });
});

export default router;
