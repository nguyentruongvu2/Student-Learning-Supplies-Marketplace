# 🧪 Hướng dẫn Test Chi Tiết

## 📋 Test Checklist

### ✅ Phần 1: Test Cơ Bản (Không cần Ngrok)

#### 1.1 Test Docker đang chạy

```powershell
# Kiểm tra containers
docker-compose ps

# Kết quả mong đợi:
# nha-cho-backend    Up (healthy)
# nha-cho-frontend   Up
```

#### 1.2 Test Backend API

```powershell
# Test health endpoint
curl.exe http://localhost:5000/api/health

# Kết quả mong đợi:
# {"trang_thai":"Máy chủ đang chạy"}
```

#### 1.3 Test Frontend trên trình duyệt

```
1. Mở Chrome/Edge
2. Truy cập: http://localhost:3000
3. Kiểm tra:
   ✅ Trang chủ hiển thị
   ✅ Navbar hiển thị đúng
   ✅ Có thể đăng ký/đăng nhập
   ✅ Xem được danh sách bài đăng
```

#### 1.4 Test Responsive (Chrome DevTools)

```
1. Mở http://localhost:3000
2. Nhấn F12 (mở DevTools)
3. Nhấn Ctrl+Shift+M (Toggle Device Toolbar)
4. Test các thiết bị:
   📱 iPhone 12/13 Pro (390x844)
   📱 Samsung Galaxy S20 (360x800)
   📱 iPad Air (820x1180)
   💻 Desktop (1920x1080)

5. Kiểm tra:
   ✅ Layout tự động điều chỉnh
   ✅ Menu mobile (hamburger) xuất hiện trên mobile
   ✅ Grid posts: 1 cột (mobile) → 2-3 cột (desktop)
   ✅ Text dễ đọc, không bị nhỏ
   ✅ Buttons đủ lớn để tap (44x44px)
   ✅ Images hiển thị đúng tỷ lệ
```

---

### 📱 Phần 2: Test với Ngrok (Truy cập từ điện thoại)

#### 2.1 Cài đặt Ngrok

**Bước 1: Tải Ngrok**

```
1. Mở trình duyệt
2. Truy cập: https://ngrok.com/download
3. Click "Download for Windows"
4. Giải nén file ZIP
5. Copy ngrok.exe vào thư mục: D:\DACN\
```

**Bước 2: Đăng ký tài khoản**

```
1. Truy cập: https://dashboard.ngrok.com/signup
2. Đăng ký bằng Google hoặc Email
3. MIỄN PHÍ 100%
```

**Bước 3: Cấu hình Authtoken**

```powershell
# 1. Sau khi đăng nhập, vào: https://dashboard.ngrok.com/get-started/your-authtoken
# 2. Copy authtoken (dạng: 2abc...xyz)
# 3. Chạy lệnh (1 LẦN DUY NHẤT):
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE

# Ví dụ:
# ngrok config add-authtoken 2a1b2c3d4e5f6g7h8i9j0k
```

**Bước 4: Kiểm tra cài đặt**

```powershell
ngrok version
# Kết quả: ngrok version 3.x.x
```

#### 2.2 Chạy Ngrok

**Terminal 1: Đảm bảo Docker đang chạy**

```powershell
docker-compose ps
# Nếu chưa chạy:
docker-compose up -d
```

**Terminal 2: Chạy Ngrok**

```powershell
# Cách 1: Dùng script (Đơn giản)
.\start-ngrok.ps1

# Cách 2: Chạy thủ công
ngrok http 3000
```

**Kết quả sẽ thấy:**

```
Session Status                online
Account                       your-email@gmail.com
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000
                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
                              COPY URL NÀY!
```

#### 2.3 Cập nhật Backend

```powershell
# 1. Copy URL từ ngrok (ví dụ: https://abc123.ngrok-free.app)

# 2. Mở file .env
notepad .env

# 3. Thêm/sửa dòng này:
CLIENT_URL=https://abc123.ngrok-free.app
FRONTEND_URL=https://abc123.ngrok-free.app

# 4. Save file và đóng notepad

# 5. Restart backend
docker-compose restart backend
```

#### 2.4 Test từ Điện thoại

**Trên điện thoại:**

```
1. Mở trình duyệt (Chrome/Safari)
2. Nhập URL: https://abc123.ngrok-free.app
3. Bấm "Visit Site" (ngrok warning - chỉ lần đầu)
4. Website hiển thị! 🎉
```

**Test các tính năng:**

```
✅ Trang chủ hiển thị đầy đủ
✅ Đăng ký tài khoản mới
✅ Đăng nhập
✅ Xem danh sách bài đăng
✅ Xem chi tiết bài đăng
✅ Tìm kiếm
✅ Tap vào buttons (đủ lớn, dễ tap)
✅ Scroll mượt mà
✅ Images load nhanh
```

#### 2.5 Test Email Verification (Quan trọng!)

```
1. Truy cập từ điện thoại: https://abc123.ngrok-free.app
2. Đăng ký tài khoản mới với email thật
3. Kiểm tra email (hộp thư đến hoặc spam)
4. Click vào link xác thực trong email
5. Link sẽ mở: https://abc123.ngrok-free.app/verify-email/...
6. Xác thực thành công!
```

---

### 🔍 Phần 3: Test Responsive Chi Tiết

#### 3.1 Test Breakpoints

**Mobile (< 640px):**

```
✅ Menu hamburger hiển thị
✅ Grid: 1 cột
✅ Search full width
✅ Buttons lớn (44x44px)
✅ Font size >= 16px
✅ Không có scroll ngang
```

**Tablet (640px - 1024px):**

```
✅ Grid: 2 cột
✅ Navbar có search bar
✅ Sidebar filter hiển thị
✅ Cards hiển thị đẹp
```

**Desktop (> 1024px):**

```
✅ Grid: 3-4 cột
✅ Full navbar với tất cả menu
✅ Sidebar cố định
✅ Max-width container
```

#### 3.2 Test Orientation

**Landscape (điện thoại ngang):**

```
1. Mở website trên điện thoại
2. Xoay ngang
3. Kiểm tra:
   ✅ Layout điều chỉnh
   ✅ Height phù hợp
   ✅ Content không bị cắt
```

#### 3.3 Test Touch Interactions

```
✅ Tap buttons: Phản hồi ngay (active state)
✅ Swipe images: Mượt mà
✅ Pull to refresh: Hoạt động
✅ Pinch to zoom images: Hoạt động
✅ Tap links: Không miss tap
```

---

### 🎨 Phần 4: Test Components Cụ Thể

#### 4.1 Navbar

```
Desktop:
✅ Logo bên trái
✅ Menu ở giữa
✅ User profile bên phải
✅ Search bar hiển thị

Mobile:
✅ Logo bên trái
✅ Hamburger menu bên phải
✅ Search icon/compact
✅ Click hamburger → menu dropdown
```

#### 4.2 Post Cards

```
✅ Images crop đúng tỷ lệ
✅ Title không bị cắt (line-clamp)
✅ Price hiển thị rõ
✅ Hover effect (desktop)
✅ Tap effect (mobile)
✅ Spacing đều
```

#### 4.3 Post Detail

```
Desktop:
✅ Images slider bên trái
✅ Info bên phải (2 columns)

Mobile:
✅ Images full width
✅ Info dưới images (stack)
✅ Comments full width
```

#### 4.4 Forms (Đăng ký/Đăng nhập)

```
✅ Inputs có height >= 44px
✅ Font size 16px (no auto-zoom iOS)
✅ Labels rõ ràng
✅ Error messages hiển thị đúng
✅ Submit button dễ tap
```

#### 4.5 Chat

```
Desktop:
✅ Conversations list bên trái
✅ Chat window bên phải
✅ Split view

Mobile:
✅ List full screen
✅ Tap conversation → chat full screen
✅ Back button về list
```

---

### 🐛 Troubleshooting

#### Lỗi: Ngrok không chạy

```powershell
# Kiểm tra version
ngrok version

# Nếu lỗi "command not found":
# 1. Đảm bảo ngrok.exe trong thư mục D:\DACN\
# 2. Hoặc chạy:
.\ngrok.exe http 3000

# Nếu lỗi "authtoken":
ngrok config add-authtoken YOUR_TOKEN
```

#### Lỗi: Website không responsive

```powershell
# Rebuild với Tailwind mới
cd Frontent
npm run build

# Nếu dùng Docker:
docker-compose up -d --build frontend
```

#### Lỗi: Link email không hoạt động

```powershell
# Kiểm tra .env có đúng không:
Get-Content .env | Select-String "CLIENT_URL"

# Phải thấy:
# CLIENT_URL=https://abc123.ngrok-free.app

# Nếu không đúng, sửa và restart:
docker-compose restart backend
```

#### Lỗi: Port 3000 bị chiếm

```powershell
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Kill process (thay PID)
taskkill /PID <PID> /F

# Hoặc đổi port ngrok:
ngrok http 3001
```

---

### 📊 Test Performance

#### Lighthouse (Chrome)

```
1. Mở http://localhost:3000
2. F12 → Tab "Lighthouse"
3. Click "Generate report"
4. Kiểm tra scores:
   ✅ Performance: > 80
   ✅ Accessibility: > 90
   ✅ Best Practices: > 90
   ✅ SEO: > 80
```

#### Network Speed

```
1. F12 → Network tab
2. Throttling: Fast 3G
3. Reload trang
4. Kiểm tra:
   ✅ Load time < 3s
   ✅ Images lazy load
   ✅ No blocking resources
```

---

### ✅ Test Checklist Tổng Hợp

**Cơ bản:**

- [ ] Docker chạy (docker-compose ps)
- [ ] Backend healthy (curl localhost:5000/api/health)
- [ ] Frontend mở được (localhost:3000)
- [ ] Đăng ký/đăng nhập hoạt động

**Responsive (DevTools):**

- [ ] Mobile (390px): 1 cột, menu hamburger
- [ ] Tablet (768px): 2 cột, sidebar
- [ ] Desktop (1920px): 3-4 cột, full layout
- [ ] Buttons >= 44x44px
- [ ] Font size >= 16px
- [ ] No horizontal scroll

**Ngrok (Điện thoại):**

- [ ] Ngrok cài đặt (ngrok version)
- [ ] Authtoken cấu hình
- [ ] Ngrok chạy (ngrok http 3000)
- [ ] .env cập nhật CLIENT_URL
- [ ] Backend restart
- [ ] Truy cập từ điện thoại
- [ ] Email verification hoạt động

**Tính năng:**

- [ ] Trang chủ hiển thị posts
- [ ] Tìm kiếm hoạt động
- [ ] Xem chi tiết post
- [ ] Tạo post mới (cần đăng nhập)
- [ ] Comment
- [ ] Chat real-time
- [ ] Upload ảnh

**Performance:**

- [ ] Images lazy load
- [ ] Smooth scrolling
- [ ] No lag khi tap
- [ ] Load time < 3s

---

### 🎯 Test Script Tự Động

Chạy lệnh này để test nhanh:

```powershell
# Test toàn bộ
Write-Host "`n=== AUTO TEST ===" -ForegroundColor Cyan

# 1. Docker
Write-Host "`n1. Docker Status:" -ForegroundColor Yellow
docker-compose ps

# 2. Backend
Write-Host "`n2. Backend API:" -ForegroundColor Yellow
curl.exe -s http://localhost:5000/api/health | ConvertFrom-Json

# 3. Frontend
Write-Host "`n3. Frontend:" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri http://localhost:3000 -TimeoutSec 5
Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green

# 4. MongoDB
Write-Host "`n4. MongoDB Data:" -ForegroundColor Yellow
docker exec nha-cho-backend node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(async () => { const db = mongoose.connection.db; const users = await db.collection('NGUOI_DUNG').countDocuments(); const posts = await db.collection('BAI_DANG').countDocuments(); console.log('Users:', users, '| Posts:', posts); await mongoose.connection.close(); });"

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Green
```

---

**Cập nhật:** 05/12/2025
