# syntax=docker/dockerfile:1.4

# ----------------------
# Base builder image
# ----------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Provide a safe placeholder so prisma generate succeeds during image builds.
ENV DATABASE_URL="postgresql://placeholder:password@localhost:5432/placeholder"

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig*.json ./
COPY server ./server
COPY scripts ./scripts
COPY startup.sh ./startup.sh

# Install all dependencies (including dev deps for TypeScript build)
RUN npm ci

# Ensure the Prisma client is generated before compilation
RUN npm run postinstall

# Build the TypeScript backend to ./dist
RUN npm run build

# ----------------------
# Runtime image
# ----------------------
FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app

# Use the non-root "node" user throughout the runtime image
RUN mkdir -p /app && chown -R node:node /app
USER node

# Install only production dependencies
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node scripts ./scripts
RUN npm ci --omit=dev && npm cache clean --force

# Copy the compiled app and supporting files
COPY --from=builder /app/dist ./dist
COPY --chown=node:node startup.sh ./startup.sh

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- "http://127.0.0.1:${PORT:-8080}/api/_int/live" >/dev/null 2>&1 || exit 1

# Start the compiled server directly
CMD ["node", "dist/server/index.js"]
