# Multi-stage Dockerfile for npm workspace monorepo

# Development Stage
FROM node:20-alpine AS development

WORKDIR /workspace

# Copy workspace configuration
COPY package*.json ./
COPY apps/api/package.json ./apps/api/

# Install all dependencies (including dev dependencies for development)
RUN npm install

# Copy source code
COPY apps/api ./apps/api

# Expose API port
EXPOSE 4000

# Start development server from workspace root with workspace-aware command
CMD ["npm", "run", "dev", "--workspace=apps/api"]

# Production Stage — expects pre-built dist from host
FROM node:20-alpine AS production

WORKDIR /workspace

ENV NODE_ENV=production

# Copy workspace root + api package files and lockfile
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

# Install only production dependencies using the lockfile
RUN npm ci --omit=dev

# Copy pre-built artifacts from host (built via: npm run build --workspace=apps/api)
COPY apps/api/dist ./apps/api/dist

# Expose API port
EXPOSE 4000

# Start production server from workspace root
CMD ["node", "apps/api/dist/index.js"]
