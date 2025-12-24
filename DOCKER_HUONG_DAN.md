# 🐳 HƯỚNG DẪN CHẠY ỨNG DỤNG TRÊN DOCKER

## 📋 Yêu Cầu

- Docker Desktop đã cài đặt và đang chạy
- MongoDB Atlas account (hoặc MongoDB local)
- File `.env` đã được cấu hình

## 🚀 Các Bước Chạy

### 1️⃣ Kiểm Tra File .env

Đảm bảo file `.env` ở thư mục gốc có đầy đủ thông tin:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
REACT_APP_API_URL=http://localhost:5000/api
```

**Quan trọng:**

- Thay `user:password` bằng thông tin MongoDB Atlas của bạn
- Thêm `?retryWrites=true&w=majority` vào cuối connection string để tránh timeout
- Đảm bảo IP của bạn được whitelist trong MongoDB Atlas (Network Access)

### 2️⃣ Build và Chạy Docker Containers

```powershell
# Dừng các container cũ (nếu có)
docker-compose down

# Build và chạy tất cả services
docker-compose up -d --build

# Hoặc chạy không detached để xem logs real-time
docker-compose up --build
```

### 3️⃣ Kiểm Tra Logs

```powershell
# Xem logs của backend
docker logs -f nha-cho-backend

# Xem logs của frontend
docker logs -f nha-cho-frontend

# Xem logs của tất cả services
docker-compose logs -f
```

**Kiểm tra kết nối MongoDB:**

- Tìm dòng `✓ MongoDB kết nối thành công` trong logs backend
- Nếu thấy lỗi `ETIMEOUT` hoặc `querySrv ETIMEOUT`, xem phần Troubleshooting

### 4️⃣ Truy Cập Ứng Dụng

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

### 5️⃣ Kiểm Tra Hiển Thị Ảnh

Để ảnh hiển thị đúng:

1. Upload ảnh qua giao diện web (tạo bài đăng mới)
2. Ảnh sẽ được lưu trong `Backend/uploads/`
3. Backend serve ảnh qua: `http://localhost:5000/uploads/filename.jpg`
4. Volume mount đảm bảo ảnh không bị mất khi restart container

## 🛠️ Các Lệnh Hữu Ích

```powershell
# Xem trạng thái containers
docker-compose ps

# Dừng containers
docker-compose stop

# Khởi động lại containers
docker-compose restart

# Xóa containers và volumes
docker-compose down -v

# Rebuild chỉ một service
docker-compose up -d --build backend

# Exec vào container backend
docker exec -it nha-cho-backend bash

# Kiểm tra kết nối MongoDB từ trong container
docker exec -it nha-cho-backend node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('OK')).catch(e => console.error(e));"
```

## 🐛 Troubleshooting

### ❌ Lỗi: MongoDB Connection Timeout

**Lỗi:** `querySrv ETIMEOUT _mongodb._tcp.cluster0.mongodb.net`

**Nguyên nhân:**

- DNS không resolve được SRV record của MongoDB Atlas
- Firewall/VPN chặn DNS queries
- Mạng không ổn định

**Giải pháp:**

1. **Kiểm tra DNS từ Windows:**

```powershell
nslookup -type=SRV _mongodb._tcp.cluster0.rfgwii8.mongodb.net
Resolve-DnsName _mongodb._tcp.cluster0.rfgwii8.mongodb.net -Type SRV
```

2. **Thử đổi DNS của máy:**

   - Settings → Network → Change adapter options
   - Chọn adapter → Properties → IPv4 → Properties
   - Thay DNS thành: `8.8.8.8` và `8.8.4.4` (Google DNS)

3. **Kiểm tra Network Access trong MongoDB Atlas:**

   - Vào MongoDB Atlas → Network Access
   - Thêm IP hiện tại hoặc cho phép `0.0.0.0/0` (tất cả IPs - chỉ dùng test)

4. **Sử dụng connection string không dùng SRV:**

   - Trong MongoDB Atlas, copy connection string dạng "Standard"
   - Thay vì: `mongodb+srv://...`
   - Dùng: `mongodb://host1:27017,host2:27017,host3:27017/dbname?...`

5. **Tạm thời dùng MongoDB local:**

```env
MONGODB_URI=mongodb://host.docker.internal:27017/student_marketplace
```

### ❌ Ảnh Không Hiển Thị

**Nguyên nhân:**

- API URL không đúng
- CORS chặn request
- Volume mount không đúng

**Giải pháp:**

1. Kiểm tra file `.env` có đúng:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

2. Rebuild frontend:

```powershell
docker-compose up -d --build frontend
```

3. Kiểm tra uploads folder:

```powershell
docker exec -it nha-cho-backend ls -la /app/uploads
```

### ❌ Frontend Không Connect Backend

**Kiểm tra:**

1. Backend đã chạy chưa: `docker logs nha-cho-backend`
2. Health check: http://localhost:5000/api/health
3. Network: `docker network inspect dacn_nha-cho-network`

**Giải pháp:**

```powershell
# Restart tất cả
docker-compose restart

# Rebuild tất cả
docker-compose down && docker-compose up -d --build
```

## 📊 Kiểm Tra Database

```powershell
# Vào container backend
docker exec -it nha-cho-backend bash

# Trong container, chạy script kiểm tra
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  await mongoose.connection.close();
});
"
```

## 🔒 Bảo Mật

**QUAN TRỌNG - Trước khi deploy production:**

1. ❌ **KHÔNG commit file `.env`** vào Git
2. ✅ Thêm `.env` vào `.gitignore`
3. ✅ Đổi `JWT_SECRET` thành chuỗi random mạnh
4. ✅ Hạn chế IP trong MongoDB Atlas Network Access
5. ✅ Dùng environment variables trên server thay vì file `.env`

## 📦 Import Dữ Liệu Mẫu

Khi chạy lần đầu, backend tự động:

1. Kiểm tra database có rỗng không
2. Nếu rỗng, chạy seed script tự động
3. Tạo categories, post types, filters mặc định

Để import backup thủ công:

```powershell
docker exec -it nha-cho-backend node /app/scripts/import-backup.js
```

## 🎯 Kết Luận

Sau khi hoàn thành các bước:

- ✅ Backend kết nối MongoDB Atlas
- ✅ Frontend hiển thị ảnh và bài đăng
- ✅ Upload ảnh hoạt động
- ✅ Real-time chat hoạt động (Socket.IO)

**Nếu gặp lỗi, kiểm tra:**

1. Logs: `docker-compose logs -f`
2. MongoDB Atlas connection string
3. Network Access whitelist
4. File `.env` đầy đủ biến

---

💡 **Tip:** Khi develop, dùng `docker-compose.dev.yml` nếu cần hot-reload:

```powershell
docker-compose -f docker-compose.dev.yml up
```
