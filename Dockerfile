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

# Builder Stage
FROM node:20-alpine AS builder

WORKDIR /workspace

# Copy workspace configuration
COPY package*.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/api/tsconfig.json ./apps/api/

# Install all dependencies
RUN npm install

# Copy source code
COPY apps/api/src ./apps/api/src

# Build from workspace root
RUN npm run build --workspace=apps/api

# Production Stage
FROM node:20-alpine AS production

WORKDIR /workspace

ENV NODE_ENV=production

# Copy workspace configuration
COPY package*.json ./
COPY apps/api/package.json ./apps/api/

# Install only production dependencies
RUN npm install --omit=dev

# Copy built artifacts from builder
COPY --from=builder /workspace/apps/api/dist ./apps/api/dist

# Expose API port
EXPOSE 4000

# Start production server from workspace root
CMD ["npm", "start", "--workspace=apps/api"]
