# === STAGE 1: Build ===
# Sử dụng base image với đầy đủ công cụ để build ứng dụng.
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc.
WORKDIR /app

# 1. Sao chép file package.json và package-lock.json để tận dụng Docker cache.
# Lớp này chỉ chạy lại khi các file package thay đổi.
COPY package*.json ./

# 2. Cài đặt tất cả các dependencies, bao gồm devDependencies.
# npm ci đảm bảo cài đặt chính xác các phiên bản trong package-lock.json
RUN npm ci

# 3. Sao chép toàn bộ source code vào.
# Lớp này chỉ chạy khi source code thay đổi.
COPY . .

# 4. Chạy lệnh build của bạn.
# Lệnh này sẽ tạo ra thư mục .output với các file đã được build.
RUN npm run build

# === STAGE 2: Production ===
# Sử dụng base image siêu nhỏ gọn, chỉ chứa môi trường Node.js cần thiết để chạy ứng dụng.
FROM node:20-alpine

# Thiết lập thư mục làm việc.
WORKDIR /app

# Sao chép các file quan trọng từ giai đoạn `builder` vào đây.
# 1. Sao chép thư mục .output đã được build.
COPY --from=builder /app/.output .output

# 2. Sao chép thư mục node_modules đã được cài đặt.
COPY --from=builder /app/node_modules ./node_modules

# 3. Sao chép các file cần thiết khác cho quá trình production.
# Thường bao gồm package.json (để các công cụ như pm2 hoạt động nếu dùng), các file tĩnh...
COPY --from=builder /app/package.json ./package.json

# Expose port để ứng dụng có thể lắng nghe kết nối.
EXPOSE 3000

# Lệnh chạy ứng dụng.
CMD [ "node", ".output/server/index.mjs" ]
