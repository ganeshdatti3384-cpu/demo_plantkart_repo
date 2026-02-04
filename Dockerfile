# ---------- Base image ----------
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Build ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Production ----------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy required files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Expose Next.js port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
