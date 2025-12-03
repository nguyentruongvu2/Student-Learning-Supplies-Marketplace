# 🚨 QUAN TRỌNG: Đọc trước khi test Email

## ⚡ Quick Fix - Email không gửi được

### 1. Chạy script kiểm tra IP (nếu dùng 2 máy khác nhau)

```bash
# Windows PowerShell
.\get-ip.ps1

# Hoặc Command Prompt
get-ip.bat
```

### 2. Test email service

```bash
cd Backend
node test-email.js
```

### 3. Xem log chi tiết

Khi submit form forgot password, kiểm tra terminal Backend:

- Nếu thành công: `✅ Email đã gửi thành công!`
- Nếu lỗi: `❌ Lỗi gửi email: ...` (xem chi tiết lỗi)

---

## 📖 Chi tiết

Xem file `EMAIL_TROUBLESHOOTING.md` để biết thêm chi tiết về:

- Cách config Gmail App Password
- Các lỗi thường gặp và cách khắc phục
- Hướng dẫn setup cho 2 máy khác nhau

---

## ⚙️ Config hiện tại

Backend `.env`:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=nguyentruongvu2023@gmail.com
EMAIL_PASSWORD=mzya gvlt mwix qywr
FRONTEND_URL=http://localhost:3000  # Đổi thành IP LAN nếu cần
```

Frontend `.env.local` (tạo nếu chưa có):

```
REACT_APP_API_URL=http://localhost:5000  # Đổi thành IP LAN nếu cần
```
