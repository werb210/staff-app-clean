// controllers/authController.js
// ---------------------------------------------------------
// Authentication Controller
// ---------------------------------------------------------

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Temporary in-memory user store (replace with Prisma later)
const users = [
  {
    id: "1",
    email: "todd.w@boreal.financial",
    passwordHash: bcrypt.hashSync("1Sucker1!", 10),
    role: "admin",
    silo: "bf",
  },
];

// ---------------------------------------------------------
// HELPER: Sign JWT
// ---------------------------------------------------------
const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      silo: user.silo,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ---------------------------------------------------------
// LOGIN
// ---------------------------------------------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ ok: false, error: "Email and password required" });

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user)
    return res.status(401).json({ ok: false, error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid)
    return res.status(401).json({ ok: false, error: "Invalid credentials" });

  const token = signToken(user);

  res.json({
    ok: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      silo: user.silo,
    },
  });
};

// ---------------------------------------------------------
// LOGOUT
// ---------------------------------------------------------
export const logout = async (req, res) => {
  // Client removes the token; server simply acknowledges
  res.json({ ok: true, message: "Logged out" });
};

// ---------------------------------------------------------
// GET CURRENT USER
// ---------------------------------------------------------
export const getMe = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ ok: false, error: "Not authenticated" });

  res.json({
    ok: true,
    user: req.user,
  });
};
