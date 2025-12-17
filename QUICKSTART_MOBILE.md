# 🚀 Quick Start - Ngrok + Responsive

## 📱 Truy cập từ Điện thoại trong 3 Bước

### Bước 1: Cài đặt Ngrok (1 lần duy nhất)

```powershell
# 1. Tải: https://ngrok.com/download
# 2. Giải nén ngrok.exe vào D:\DACN\
# 3. Đăng ký: https://dashboard.ngrok.com/signup
# 4. Copy authtoken và chạy:
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### Bước 2: Chạy Ứng dụng

```powershell
# Khởi động Docker
docker-compose up -d

# Chạy Ngrok
.\start-ngrok.ps1
# hoặc: ngrok http 3000
```

### Bước 3: Cập nhật Backend

```powershell
# Copy URL từ ngrok (ví dụ: https://abc123.ngrok-free.app)
# Mở .env và thêm:
CLIENT_URL=https://abc123.ngrok-free.app

# Restart backend
docker-compose restart backend
```

### ✅ Xong! Truy cập từ điện thoại:

- Mở trình duyệt trên điện thoại
- Nhập: `https://abc123.ngrok-free.app`
- Bấm "Visit Site"

---

## 🎨 Responsive Design

Website tự động điều chỉnh cho mọi màn hình!

### Kiểm tra responsive:

```powershell
# Chrome DevTools
F12 → Ctrl+Shift+M

# Hoặc test thực tế
.\start-ngrok.ps1
# Truy cập từ điện thoại
```

### Tính năng responsive:

- ✅ Menu mobile (hamburger)
- ✅ Grid tự động (1→2→3 cột)
- ✅ Buttons lớn (44px) cho touch
- ✅ Images tự động scale
- ✅ Forms tối ưu mobile

---

## 📚 Tài liệu đầy đủ

- **Ngrok:** `NGROK_GUIDE.md`
- **Responsive:** `RESPONSIVE_DESIGN.md`
- **Docker:** `DOCKER_COMPLETE_GUIDE.md`
- **General:** `README.md`

---

## 🆘 Troubleshooting

### Ngrok không chạy?

```powershell
# Kiểm tra version
ngrok version

# Nếu lỗi, cài lại authtoken
ngrok config add-authtoken YOUR_TOKEN
```

### Website không responsive?

```powershell
# Rebuild frontend với Tailwind mới
cd Frontent
npm run build

# Restart Docker
docker-compose restart frontend
```

### Link email không hoạt động?

```powershell
# Đảm bảo đã cập nhật .env
CLIENT_URL=https://abc123.ngrok-free.app

# Restart backend
docker-compose restart backend
```

---

**Cập nhật:** 05/12/2025
