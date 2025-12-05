# 📦 Hướng Dẫn Đóng Gói Docker Hoàn Chỉnh

## 🎯 Mục Tiêu

Đóng gói toàn bộ ứng dụng (Frontend + Backend + MongoDB) vào Docker với dữ liệu đầy đủ như trên local.

## 📋 Yêu Cầu Hệ Thống

- Docker Desktop (Windows/Mac) hoặc Docker Engine (Linux)
- Docker Compose v2.x
- MongoDB local đang chạy (để backup dữ liệu)
- 4GB RAM trở lên
- 10GB dung lượng đĩa trống

---

## 🚀 Quy Trình Đóng Gói (3 Bước)

### **BƯỚC 1: Backup Dữ Liệu Local**

#### Windows (PowerShell):

```powershell
# Backup dữ liệu từ MongoDB local
.\backup-local-data.ps1
```

#### Linux/Mac:

```bash
# Cấp quyền thực thi
chmod +x backup-local-data.sh

# Chạy backup
./backup-local-data.sh
```

**Kết quả:** Dữ liệu được export vào thư mục `Backend/mongo-backup/`

**Kiểm tra:**

```powershell
# Xem các file backup đã tạo
Get-ChildItem Backend\mongo-backup\*.json
```

---

### **BƯỚC 2: Cấu Hình Môi Trường**

Tạo file `.env` trong thư mục gốc:

```env
# JWT Secret (QUAN TRỌNG: Đổi trong production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: Client URL
CLIENT_URL=http://localhost:3000
```

**Lưu ý Email:**

- Sử dụng Gmail App Password (không phải mật khẩu thường)
- Hướng dẫn tạo App Password: https://support.google.com/accounts/answer/185833

---

### **BƯỚC 3: Build & Khởi Động Docker**

#### 3.1. Build Images

```powershell
# Build tất cả services
docker-compose build

# Hoặc build từng service riêng
docker-compose build mongodb
docker-compose build backend
docker-compose build frontend
```

#### 3.2. Khởi Động Services

```powershell
# Khởi động tất cả (detached mode)
docker-compose up -d

# Xem logs real-time
docker-compose logs -f

# Xem logs từng service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

#### 3.3. Kiểm Tra Trạng Thái

```powershell
# Xem tất cả containers đang chạy
docker-compose ps

# Kiểm tra health status
docker ps --format "table {{.Names}}\t{{.Status}}"
```

---

## ✅ Kiểm Tra Ứng Dụng

### 1. Kiểm Tra Endpoints

```powershell
# Backend API
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:3000
```

### 2. Truy Cập Ứng Dụng

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017

### 3. Đăng Nhập Thử

Sử dụng tài khoản từ dữ liệu backup hoặc tài khoản seed:

- **Admin:** admin@example.com / admin123456
- **User:** student1@example.com / student123456

### 4. Kiểm Tra Dữ Liệu

```powershell
# Kết nối vào MongoDB container
docker exec -it nha-cho-mongodb mongosh

# Trong mongosh:
use nha-cho-sinh-vien
db.users.countDocuments()    # Đếm số users
db.posts.countDocuments()    # Đếm số posts
db.comments.countDocuments() # Đếm số comments
exit
```

---

## 🔄 Các Lệnh Quản Lý

### Dừng Services

```powershell
# Dừng nhưng giữ data
docker-compose stop

# Dừng và xóa containers (giữ volumes)
docker-compose down

# Dừng và xóa CẢ volumes (mất data!)
docker-compose down -v
```

### Khởi Động Lại

```powershell
# Khởi động lại tất cả
docker-compose restart

# Khởi động lại từng service
docker-compose restart backend
docker-compose restart frontend
```

### Xem Logs

```powershell
# Logs tất cả services
docker-compose logs -f

# Logs 100 dòng cuối
docker-compose logs --tail=100

# Logs từ 10 phút trước
docker-compose logs --since 10m
```

### Rebuild & Update

```powershell
# Rebuild khi có thay đổi code
docker-compose up -d --build

# Rebuild một service cụ thể
docker-compose up -d --build backend
```

---

## 🐛 Xử Lý Sự Cố

### Lỗi: MongoDB không khởi động

```powershell
# Xem logs MongoDB
docker-compose logs mongodb

# Xóa volumes và khởi động lại
docker-compose down -v
docker-compose up -d
```

### Lỗi: Backend không kết nối MongoDB

```powershell
# Kiểm tra network
docker network ls
docker network inspect nha-cho-network

# Kiểm tra biến môi trường
docker exec nha-cho-backend env | grep MONGO
```

### Lỗi: Frontend không kết nối Backend

```powershell
# Kiểm tra backend có chạy không
curl http://localhost:5000/api/health

# Rebuild frontend
docker-compose up -d --build frontend
```

### Lỗi: Port đã được sử dụng

```powershell
# Tìm process đang dùng port
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :27017

# Kill process (thay PID)
taskkill /PID <PID> /F
```

### Xem Thông Tin Chi Tiết Container

```powershell
# Inspect container
docker inspect nha-cho-backend

# Xem resource usage
docker stats

# Vào trong container để debug
docker exec -it nha-cho-backend sh
```

---

## 📦 Import/Export Dữ Liệu

### Export Dữ Liệu Từ Docker

```powershell
# Export tất cả collections
docker exec nha-cho-backend node scripts/copy-local-data.js
```

### Import Dữ Liệu Thủ Công

```powershell
# Import từ backup folder
docker exec nha-cho-backend node scripts/import-backup.js
```

### Backup Volumes

```powershell
# Backup MongoDB volume
docker run --rm -v nha-cho-mongodb_data:/data -v ${PWD}:/backup alpine tar czf /backup/mongodb-backup.tar.gz -C /data .

# Restore MongoDB volume
docker run --rm -v nha-cho-mongodb_data:/data -v ${PWD}:/backup alpine tar xzf /backup/mongodb-backup.tar.gz -C /data
```

---

## 🚢 Deploy Production

### 1. Tạo Production Images

```powershell
# Build với tag production
docker-compose -f docker-compose.yml build

# Tag images
docker tag nha-cho-frontend:latest your-registry/nha-cho-frontend:v1.0
docker tag nha-cho-backend:latest your-registry/nha-cho-backend:v1.0
```

### 2. Push Lên Registry

```powershell
# Login Docker Hub
docker login

# Push images
docker push your-registry/nha-cho-frontend:v1.0
docker push your-registry/nha-cho-backend:v1.0
```

### 3. Deploy Trên Server

```bash
# Trên server production
git clone your-repo
cd your-repo

# Copy .env
cp .env.example .env
nano .env  # Điền thông tin production

# Khởi động
docker-compose up -d
```

---

## 🔒 Bảo Mật Production

### 1. Thay Đổi Secrets

```env
# Tạo JWT secret mạnh
JWT_SECRET=$(openssl rand -base64 32)

# Sử dụng MongoDB với authentication
MONGODB_URI=mongodb://user:password@mongodb:27017/nha-cho-sinh-vien
```

### 2. Cấu Hình MongoDB Authentication

Tạo file `docker-compose.prod.yml`:

```yaml
services:
  mongodb:
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: your-strong-password
```

### 3. HTTPS với Nginx

Thêm Nginx reverse proxy với SSL certificate.

---

## 📊 Monitoring & Logs

### Xem Resource Usage

```powershell
# CPU, Memory, Network usage
docker stats

# Disk usage
docker system df
```

### Centralized Logging

```powershell
# Export logs
docker-compose logs > app.log

# Với timestamp
docker-compose logs --timestamps > app-$(Get-Date -Format 'yyyyMMdd-HHmmss').log
```

---

## 🧹 Dọn Dẹp

### Xóa Containers & Volumes

```powershell
# Dừng và xóa tất cả
docker-compose down -v

# Xóa images
docker rmi nha-cho-frontend nha-cho-backend

# Xóa volumes orphaned
docker volume prune -f
```

### Dọn Dẹp Hệ Thống

```powershell
# Xóa tất cả containers đã dừng
docker container prune -f

# Xóa tất cả images không dùng
docker image prune -a -f

# Xóa tất cả (NGUY HIỂM!)
docker system prune -a --volumes -f
```

---

## 📚 Tài Liệu Tham Khảo

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

---

## 📞 Support

Nếu gặp vấn đề, tạo issue tại: [GitHub Issues](https://github.com/your-repo/issues)

---

**Cập nhật:** 05/12/2025
**Phiên bản:** 1.0.0
