import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// basic health route so we know the server is up
app.get("/health", (_req, res) => {
  res.json({ ok: true, status: "staff-server-up" });
});

// keep your existing routers here when we wire them back in
// e.g. app.use("/api/contacts", contactsRouter);

export default app;
