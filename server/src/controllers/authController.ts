import { userService } from "../services/userService.js";

export const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const result = await userService.authenticate(email, password);

    if (!result) return res.status(401).json({ error: "Invalid credentials" });

    res.json(result);
  },

  register: async (req, res) => {
    res.json(await userService.create(req.body));
  },
};
