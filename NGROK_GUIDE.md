# 🌐 Email Verification với Ngrok

## 📋 Vấn đề

Khi test email verification/reset password từ máy khác hoặc điện thoại, link trong email sẽ là `http://localhost:3000/...` và không hoạt động vì chỉ trỏ đến máy local.

## ✅ Giải pháp: Sử dụng Ngrok

Ngrok tạo public URL trỏ về localhost, cho phép truy cập từ mọi thiết bị.

## 🚀 Cài đặt Ngrok

### Windows (PowerShell):

```powershell
# Cách 1: Tải từ website
# 1. Truy cập https://ngrok.com/download
# 2. Tải ngrok.exe
# 3. Giải nén và copy vào thư mục trong PATH

# Cách 2: Dùng Chocolatey
choco install ngrok

# Cách 3: Dùng Scoop
scoop install ngrok
```

### Mac/Linux:

```bash
# Mac (Homebrew)
brew install ngrok/ngrok/ngrok

# Linux (Snap)
sudo snap install ngrok
```

## 🔑 Đăng ký và Xác thực

1. **Đăng ký tài khoản miễn phí**: https://dashboard.ngrok.com/signup
2. **Lấy authtoken**: https://dashboard.ngrok.com/get-started/your-authtoken
3. **Cấu hình authtoken**:

```powershell
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

## 🎯 Sử dụng

### 1. Chạy Backend và Frontend

```powershell
# Terminal 1: Backend
cd D:\DACN\Backend
npm start

# Terminal 2: Frontend
cd D:\DACN\Frontent
npm start
```

### 2. Chạy Ngrok cho Frontend

```powershell
# Terminal 3: Ngrok
ngrok http 3000
```

**Output mẫu:**

```
Session Status                online
Account                       your-email@gmail.com
Version                       3.x.x
Region                        Asia Pacific (ap)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000
```

### 3. Cập nhật Backend .env

Copy URL từ ngrok (ví dụ: `https://abc123.ngrok-free.app`) và cập nhật:

```env
# Backend/.env
FRONTEND_URL=https://abc123.ngrok-free.app
CLIENT_URL=https://abc123.ngrok-free.app
```

### 4. Restart Backend

```powershell
# Ctrl+C để dừng backend, sau đó:
npm start
```

## 📧 Test Email Verification

### A. Đăng ký tài khoản mới

1. **Truy cập**: `https://abc123.ngrok-free.app/register`
2. **Đăng ký** với email thật của bạn
3. **Kiểm tra email** - Link sẽ là: `https://abc123.ngrok-free.app/verify-email/TOKEN`
4. **Click link** - Hoạt động từ bất kỳ thiết bị nào!

### B. Reset Password

1. **Truy cập**: `https://abc123.ngrok-free.app/forgot-password`
2. **Nhập email** đã đăng ký
3. **Kiểm tra email** - Link: `https://abc123.ngrok-free.app/reset-password/TOKEN`
4. **Click link và đặt mật khẩu mới**

## 🔍 Debug với Ngrok Web Interface

Ngrok cung cấp web interface để xem requests:

```
http://127.0.0.1:4040
```

Bạn có thể xem:

- Tất cả HTTP requests
- Request/Response headers
- Request body
- Response status codes

## ⚡ Quick Commands

```powershell
# Chạy ngrok cho frontend (port 3000)
ngrok http 3000

# Chạy với domain tùy chỉnh (cần plan trả phí)
ngrok http --domain=your-domain.ngrok.app 3000

# Chạy với basic auth
ngrok http 3000 --auth="username:password"

# Chạy với region cụ thể
ngrok http 3000 --region=ap  # Asia Pacific
```

## 🎨 Script Tự động

Tạo file `start-with-ngrok.ps1`:

```powershell
# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\DACN\Backend; npm start"

# Start Frontend
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\DACN\Frontent; npm start"

# Start Ngrok
Start-Sleep -Seconds 5
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 3000"

Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host "⏳ Wait for ngrok URL, then update Backend/.env" -ForegroundColor Yellow
Write-Host "   FRONTEND_URL=https://your-ngrok-url.ngrok-free.app" -ForegroundColor Cyan
```

Chạy: `.\start-with-ngrok.ps1`

## 📱 Test từ Điện thoại

1. **Lấy ngrok URL**: `https://abc123.ngrok-free.app`
2. **Mở trình duyệt điện thoại**
3. **Truy cập URL ngrok**
4. **Đăng ký/Forgot password** với email của bạn
5. **Mở email trên điện thoại**
6. **Click link xác minh** - Sẽ hoạt động!

## ⚠️ Lưu ý Quan trọng

### 1. URL Ngrok thay đổi mỗi lần chạy (Free plan)

Mỗi khi restart ngrok, bạn sẽ có URL mới. Cần:

- Cập nhật `FRONTEND_URL` trong Backend `.env`
- Restart backend

### 2. Giữ ngrok chạy

Ngrok phải chạy liên tục. Nếu tắt:

- URL không hoạt động nữa
- Email links sẽ broken

### 3. Security

Ngrok free plan là public, ai cũng có thể truy cập. Nếu cần bảo mật:

```powershell
ngrok http 3000 --auth="username:password"
```

### 4. Rate Limiting

Free plan có giới hạn:

- 40 requests/phút
- 1 ngrok process cùng lúc

## 🎯 Alternative: Dùng Static Domain (Paid)

Nếu thường xuyên dùng, nên upgrade ngrok để có static domain:

```powershell
# Sau khi upgrade
ngrok http --domain=your-custom-domain.ngrok.app 3000
```

Lợi ích:

- URL không đổi
- Không cần update `.env` mỗi lần
- Professional hơn

## 🐛 Troubleshooting

### Ngrok không kết nối

```powershell
# Kiểm tra authtoken
ngrok config check

# Xem config file
ngrok config edit
```

### Email link không hoạt động

1. **Kiểm tra Backend logs**: Đảm bảo `FRONTEND_URL` đúng
2. **Kiểm tra ngrok**: Đảm bảo ngrok đang chạy
3. **Test URL**: Mở `https://your-ngrok-url.ngrok-free.app` trong browser

### ERR_NGROK_8012 (Rate limit)

Đợi 1 phút hoặc upgrade plan.

## 📚 Resources

- **Ngrok Dashboard**: https://dashboard.ngrok.com
- **Documentation**: https://ngrok.com/docs
- **Pricing**: https://ngrok.com/pricing
- **Status Page**: https://status.ngrok.com

## ✨ Tips

1. **Bookmark ngrok web interface**: `http://127.0.0.1:4040`
2. **Save ngrok URL** mỗi lần để reuse trong session
3. **Dùng ngrok để demo** cho người khác
4. **Test webhook** với ngrok
5. **Debug mobile issues** dễ dàng

---

Happy Testing! 🚀
