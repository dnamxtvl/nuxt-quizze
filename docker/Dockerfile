# STAGE 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json trước
COPY package*.json ./

# Sử dụng cache để giữ node_modules
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# STAGE 2: Runtime
FROM node:20-alpine
WORKDIR /app

# Chỉ copy output và node_modules đã build sẵn
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
