# STAGE 1: Build
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy các file dependency trước để tận dụng Docker cache.
# Lớp này chỉ thay đổi khi các file package thay đổi.
COPY package*.json ./

# Cài đặt dependencies. Layer này chỉ bị vô hiệu hóa khi package.json thay đổi.
RUN npm ci

# Copy toàn bộ mã nguồn. Lớp này sẽ thường xuyên thay đổi.
# Layer này và các layer sau sẽ bị vô hiệu hóa cache khi mã nguồn thay đổi.
COPY . .

# Chạy lệnh build của bạn.
RUN npm run build

# STAGE 2: Production
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép các files cần thiết từ giai đoạn builder
# Chỉ sao chép những file đã được build và node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules

# Expose port và chạy ứng dụng
EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]