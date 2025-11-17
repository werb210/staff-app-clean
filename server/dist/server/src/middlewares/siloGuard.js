const ALLOWED_SILOS = ["bf", "slf"];

export default function siloGuard(req, res, next) {
  const silo = req.params.silo ? req.params.silo.toLowerCase() : null;

  if (!silo || !ALLOWED_SILOS.includes(silo)) {
    return res
      .status(400)
      .json({ ok: false, error: `Invalid silo '${silo}'. Allowed: bf, slf.` });
  }

  req.silo = silo;
  next();
}
