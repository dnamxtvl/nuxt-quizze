# STAGE 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable

# Copy package.json trước
COPY package*.json .npmrc ./

# Sử dụng cache để giữ node_modules
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# STAGE 2: Runtime
FROM node:20-alpine
WORKDIR /app

# Chỉ copy output và node_modules đã build sẵn
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
