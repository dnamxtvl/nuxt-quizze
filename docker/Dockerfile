# STAGE 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json trước
COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/app/node_modules/.cache \
    npm ci --prefer-offline

# Copy source code
COPY . .

# Build với cache mount
RUN --mount=type=cache,target=/app/.nuxt/cache \
    --mount=type=cache,target=/app/.vite \
    --mount=type=cache,target=/app/node_modules/.cache \
    npm run build


# STAGE 2: Runtime
FROM node:20-alpine
WORKDIR /app

# Chỉ copy output và node_modules đã build sẵn
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
