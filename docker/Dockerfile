# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json & lockfile
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Build ra .output
RUN npm run build

# Stage 2: runtime
FROM node:20-alpine
WORKDIR /app

# Copy output từ builder
COPY --from=builder /app/.output ./.output

# Chỉ cần Node để chạy
CMD ["node", ".output/server/index.mjs"]
