// middlewares/errorHandler.js
// ---------------------------------------------------------
// Global Error Handler (Express 5)
// ---------------------------------------------------------

export const errorHandler = (err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  const status = err.status || 500;

  const response = {
    ok: false,
    status,
    error: err.message || "Internal Server Error",
  };

  // Only expose stack traces in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

export default errorHandler;
