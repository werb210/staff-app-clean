// server/src/index.ts
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { loadEnv } from './config/env.js';
import applicationRoutes from './routes/application.js';
import documentRoutes from './routes/documents.js';
import bankingRoutes from './routes/banking.js';
import chatRoutes from './routes/chat.js';
import signingRoutes from './routes/signing.js';
import { requestLogger } from './middleware/requestLogger.js';
import auditRoutes from './routes/audit.js';
import { initWebsocket } from "./realtime/ws.js";

//
// =======================================================
//  1. Load and Validate Environment
// =======================================================
//
const env = loadEnv(); 
// loadEnv() WILL throw if any required variables are missing.

//
// =======================================================
//  2. Express App Setup
// =======================================================
//
const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(requestLogger);

//
// =======================================================
//  4. Basic Health Routes
// =======================================================
//
app.get('/api/_int/health', (req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: 'staff-server', time: new Date().toISOString() });
});

app.get('/api/_int/ping', (req: Request, res: Response) => {
  res.status(200).json({ message: 'pong' });
});

//
// =======================================================
//  5. Core Routes
// =======================================================
//
app.use('/api/application', applicationRoutes);

app.use('/api/documents', documentRoutes);

app.use('/api/banking', bankingRoutes);

app.use('/api/chat', chatRoutes);

app.use('/api/pipeline', (req, res) => {
  res.status(501).json({ error: 'Pipeline routes not implemented yet (Codex Block 10)' });
});

app.use('/api/signing', signingRoutes);
app.use('/api/audit', auditRoutes);

//
// =======================================================
//  6. Global Error Handler
// =======================================================
//
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('SERVER ERROR →', err);

  return res.status(500).json({
    error: true,
    message: err?.message || 'Internal Server Error',
  });
});

//
// =======================================================
//  7. Create HTTP + WebSocket Servers
// =======================================================
//
//
// =======================================================
//  8. Start Server
// =======================================================
//
const PORT = env.PORT || 5000;

const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Staff-Server running on port ${PORT}`);
});

initWebsocket(httpServer);
