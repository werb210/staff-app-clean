#!/usr/bin/env bash
set -euo pipefail

echo "🚨 STARTING TOTAL REBUILD — Codex Backend + Full DB Reset + Silo Enforcement"

#############################################
# 0. SAFETY CHECK
#############################################
if [ ! -d ".git" ]; then
  echo "❌ Not a git repo. Run at project root."
  exit 1
fi

#############################################
# 1. DELETE EXISTING BACKEND + CLIENT
#############################################
echo "🗑 Removing old server, client, dist, routes, controllers, schemas..."

rm -rf server/
rm -rf next/
rm -rf dist/
rm -rf controllers/
rm -rf routes/
rm -rf services/
rm -rf types/
rm -rf schemas/
rm -rf prisma/
rm -rf utils/

#############################################
# 2. CREATE CLEAN BACKEND FOLDER
#############################################
echo "📁 Creating backend/ folder"

mkdir -p backend
cd backend

#############################################
# 3. INITIALIZE NEW BACKEND PROJECT
#############################################
echo "🔧 Initializing clean Node project"
npm init -y

#############################################
# 4. INSTALL CODEX BACKEND ENGINE
#############################################
echo "📦 Installing Codex"
npm install @codex/core @codex/node @codex/cli zod typescript ts-node nodemon dotenv

#############################################
# 5. SETUP TYPESCRIPT
#############################################
echo "📝 Creating tsconfig.json"

cat > tsconfig.json << 'JSON'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
JSON

#############################################
# 6. CREATE BACKEND SOURCE TREE
#############################################
echo "📁 Creating folder structure"

mkdir -p src/{core,models,controllers,services,routes,middleware,prisma,silos,auth}

#############################################
# 7. INITIALIZE PRISMA WITH 3-SILO MODEL
#############################################
echo "⚙️ Setting up Prisma schema with BF, BI, SLF silos"

cat > src/prisma/schema.prisma << 'PRISMA'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Silo {
  BF
  BI
  SLF
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  roles     String[]
  silos     Silo[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Contact {
  id        String   @id @default(uuid())
  silo      Silo
  name      String
  phone     String?
  email     String?
  createdAt DateTime @default(now())
}

model Application {
  id          String   @id @default(uuid())
  silo        Silo
  contactId   String
  contact     Contact  @relation(fields: [contactId], references: [id])
  stage       String
  data        Json
  createdAt   DateTime @default(now())
}
PRISMA

#############################################
# 8. GENERATE PRISMA CLIENT (after delete-all)
#############################################
echo "🗄 Dropping and recreating ALL database tables"
npx prisma migrate reset -f

echo "🔨 Generating Prisma client"
npx prisma generate

#############################################
# 9. CREATE SILO MIDDLEWARE
#############################################
echo "🔐 Creating siloGuard"

cat > src/middleware/siloGuard.ts << 'TS'
import type { Request, Response, NextFunction } from "express";
import { Silo } from "@prisma/client";

export function siloGuard(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  const requiredSilo = req.params.silo || req.body.silo;

  if (!user) return res.status(401).json({ error: "Unauthenticated" });
  if (!requiredSilo) return res.status(400).json({ error: "Missing silo" });

  if (!user.silos.includes(requiredSilo)) {
    return res.status(403).json({ error: "Access denied for this silo" });
  }

  next();
}
TS

#############################################
# 10. CREATE AUTH SYSTEM (RBAC + SILOS)
#############################################
echo "🔑 Creating auth system"

cat > src/auth/auth.ts << 'TS'
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({ where: { id: (decoded as any).id }});
    if (!user) return res.status(401).json({ error: "User not found" });

    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
TS

#############################################
# 11. CREATE API SERVER
#############################################
echo "🌐 Creating API server"

cat > src/index.ts << 'TS'
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "./auth/auth.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(3001, () => console.log("🔥 Codex backend running on http://localhost:3001"));
TS

#############################################
# 12. ADD PACKAGE SCRIPTS
#############################################
echo "📝 Updating package.json scripts"

cat > package.json << 'JSON'
{
  "name": "codex-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon --watch src --exec node --loader ts-node/esm src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "migrate": "prisma migrate dev",
    "reset": "prisma migrate reset -f",
    "generate": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^5.13.0",
    "@codex/core": "*",
    "@codex/node": "*",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.1",
    "express": "^4.21.1",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "nodemon": "^3.1.0",
    "prisma": "^5.13.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
JSON

#############################################
# ALL DONE
#############################################
echo "🎉 TOTAL REBUILD COMPLETE"
echo "➡ Run backend with:  cd backend && npm run dev"
