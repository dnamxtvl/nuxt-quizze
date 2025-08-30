# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build   # Tạo ra thư mục .output

# Stage 2: runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output
RUN npm install --production --ignore-scripts --prefer-offline
CMD ["node", ".output/server/index.mjs"]
