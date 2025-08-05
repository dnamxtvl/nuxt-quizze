FROM node:20-alpine

WORKDIR /app

# 1. Copy package files first
COPY package*.json ./

# 2. Clean install (xoá node_modules cũ nếu có)
RUN rm -rf node_modules && \
    npm ci --omit=dev

RUN npm install
# 3. Copy toàn bộ code (EXCLUDE node_modules và .output trong .dockerignore)
COPY . .

# 4. Build ứng dụng (luôn tạo .output mới)
RUN rm -rf .output && \
    npm run build

EXPOSE 3000

# 5. Chạy trực tiếp từ file build (không dùng npm run start)
CMD [ "node", ".output/server/index.mjs" ]