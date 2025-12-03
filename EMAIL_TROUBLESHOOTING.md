# 🔧 Hướng dẫn khắc phục lỗi Email

## ❌ Vấn đề: Không thể gửi email

### 1. Kiểm tra cấu hình Backend (.env)

Mở file `Backend\.env` và kiểm tra:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=nguyentruongvu2023@gmail.com
EMAIL_PASSWORD=mzya gvlt mwix qywr  # App Password, không phải mật khẩu thường
EMAIL_FROM=noreply@nha-cho-sinh-vien.com
```

### 2. Kiểm tra Gmail App Password

- Truy cập: https://myaccount.google.com/apppasswords
- Tạo App Password mới cho "Mail"
- Copy password (16 ký tự không có dấu cách) vào `EMAIL_PASSWORD`

### 3. Test email service

Chạy lệnh test:

```bash
cd Backend
node test-email.js
```

Nếu thành công, bạn sẽ thấy:

```
✅ Email sent successfully!
```

### 4. Kiểm tra Backend logs

Khi submit forgot password form, xem terminal backend:

```
📧 Forgot Password Request:
📬 Email nhận: xxx@gmail.com
👤 Tìm user: ✓ Có
🔑 Reset token đã tạo: xxx
🔗 Reset URL: http://localhost:3000/reset-password/xxx
📤 Đang gửi email...
📧 Đang gửi email đặt lại mật khẩu...
✅ Email đặt lại mật khẩu đã gửi tới: xxx@gmail.com
✅ Email đã gửi thành công!
```

Nếu có lỗi, sẽ hiển thị chi tiết:

```
❌ Lỗi gửi email: ...
📋 Chi tiết lỗi: { code: 'EAUTH', ... }
```

### 5. Lỗi thường gặp

#### EAUTH - Authentication failed

- **Nguyên nhân**: Sai password hoặc chưa bật App Password
- **Giải pháp**:
  1. Bật 2FA cho Gmail
  2. Tạo App Password mới
  3. Update `EMAIL_PASSWORD` trong .env

#### ECONNECTION - Connection refused

- **Nguyên nhân**: Firewall/antivirus chặn port 587
- **Giải pháp**: Tắt tạm firewall hoặc cho phép Node.js

#### Timeout

- **Nguyên nhân**: Mạng chậm hoặc Gmail block
- **Giải pháp**: Đợi vài phút, thử lại

---

## ❌ Vấn đề: Email verification không hoạt động trên máy khác

### Nguyên nhân

Link verification dạng `http://localhost:3000/verify-email/...` chỉ hoạt động trên máy server.

### Giải pháp

#### Bước 1: Tìm IP LAN của máy server

**Windows:**

```bash
ipconfig
```

Tìm `IPv4 Address` (ví dụ: `192.168.1.100`)

**Mac/Linux:**

```bash
ifconfig
```

#### Bước 2: Cấu hình Backend

Sửa `Backend\.env`:

```env
FRONTEND_URL=http://192.168.1.100:3000
```

#### Bước 3: Cấu hình Frontend

**Option 1: Tạo file `.env.local`** (recommended)

Trong thư mục `Frontent`, tạo file `.env.local`:

```env
REACT_APP_API_URL=http://192.168.1.100:5000
```

**Option 2: Sửa trực tiếp**

File `Frontent\src\services\api.js`:

```javascript
const API_URL = "http://192.168.1.100:5000";
```

#### Bước 4: Khởi động lại

1. Stop cả Frontend và Backend (Ctrl+C)
2. Khởi động lại Backend:
   ```bash
   cd Backend
   npm start
   ```
3. Khởi động lại Frontend:
   ```bash
   cd Frontent
   npm start
   ```

#### Bước 5: Truy cập từ máy khác

- URL: `http://192.168.1.100:3000`
- Email verification link sẽ có dạng: `http://192.168.1.100:3000/verify-email/...`

### Lưu ý quan trọng

1. **Firewall**: Đảm bảo port 3000 và 5000 không bị chặn
2. **Cùng mạng LAN**: Cả 2 máy phải cùng WiFi/mạng
3. **IP tĩnh**: IP có thể thay đổi, cần update lại nếu khởi động lại router

---

## ✅ Checklist Debug

- [ ] Backend đang chạy (terminal không có lỗi)
- [ ] Frontend đang chạy
- [ ] File `.env` có đầy đủ config email
- [ ] Email password là App Password (16 ký tự)
- [ ] Test email thành công (`node test-email.js`)
- [ ] Backend log hiển thị "Email đã gửi thành công"
- [ ] Kiểm tra cả hộp thư spam
- [ ] Nếu dùng máy khác: FRONTEND_URL dùng IP LAN
- [ ] Nếu dùng máy khác: REACT_APP_API_URL dùng IP LAN

---

## 🆘 Vẫn không được?

1. **Kiểm tra console browser** (F12 → Console tab)
2. **Kiểm tra Network tab** (F12 → Network → XHR)
3. **Copy log terminal backend** để debug
4. **Thử email khác** (không phải Gmail, thử Outlook/Yahoo)
