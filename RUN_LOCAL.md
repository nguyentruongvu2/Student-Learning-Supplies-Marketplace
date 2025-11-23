# Hướng dẫn chạy ứng dụng local (Backend + Frontend)

Hướng dẫn này trình bày các bước cho Windows PowerShell để chạy toàn bộ dự án trên máy phát triển.

## Yêu cầu tối thiểu

- Node.js >=16 và `npm`
- MongoDB (local) hoặc MongoDB Atlas
- Git (tuỳ chọn)

## 1) Chuẩn bị chung

- Mở PowerShell với quyền người dùng bình thường.
- Clone hoặc đặt source code ở `d:\DACN` như cấu trúc hiện tại.

## 2) Backend — cài đặt và chạy

Mở một terminal PowerShell mới và chạy:

```powershell
cd d:\DACN\Backend
npm install
Copy-Item -Path .env.example -Destination .env
# Mở file .env và chỉnh: MONGODB_URI, JWT_SECRET
```

Ví dụ `Backend/.env` tối thiểu (dev local):

```dotenv
MONGODB_URI=mongodb://localhost:27017/nha-cho-sinh-vien
PORT=5000
JWT_SECRET=thay_the_bang_khoa_cua_ban
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Chạy server trong chế độ dev:

```powershell
npm run dev
# hoặc production:
npm start
```

Server mặc định sẽ lắng nghe trên `http://localhost:5000`. API base: `http://localhost:5000/api`.

Kiểm tra trạng thái server:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

## 3) Tạo dữ liệu test (tài khoản + bài viết mẫu)

Sau khi backend chạy, chạy script seed để tạo sẵn các tài khoản test:

```powershell
# Tạo tài khoản test + bài viết mẫu
npm run seed

# Hoặc reset dữ liệu cũ rồi tạo lại (cẩn thận!)
npm run seed:fresh
```

**Tài khoản test có sẵn:**

| Email                | Password      | Role      |
| -------------------- | ------------- | --------- |
| admin@example.com    | admin123456   | Admin     |
| student1@example.com | student123456 | Sinh viên |
| student2@example.com | student123456 | Sinh viên |

## 4) Frontend — cài đặt và chạy

Mở terminal PowerShell khác và chạy:

```powershell
cd d:\DACN\Frontent
npm install
Copy-Item -Path .env.example -Destination .env
# Chỉnh file .env nếu cần (REACT_APP_API_URL, REACT_APP_SOCKET_URL)
npm start
```

Frontend mặc định chạy tại `http://localhost:3000`.

Ví dụ `Frontent/.env` (được copy từ `.env.example`):

```dotenv
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 5) Upload ảnh khi chạy local

- Nếu không cấu hình Cloudinary, file upload sẽ lưu vào thư mục `d:\DACN\Backend\uploads` và được phục vụ qua:
  `http://localhost:5000/uploads/<filename>`

Kiểm tra upload bằng PowerShell:

```powershell
$file = Get-Item 'C:\path\to\image.jpg'
Invoke-RestMethod -Uri http://localhost:5000/api/upload/image -Method Post -InFile $file -ContentType 'multipart/form-data'
```

## 6) Cấu hình tùy chọn (Cloudinary / Email)

- Cloudinary (upload lên cloud): thêm vào `Backend/.env`:

```dotenv
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

- Email (gửi email xác minh): thêm vào `Backend/.env`:

```dotenv
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=you@example.com
EMAIL_PASSWORD=app_password_or_smtp_pass
EMAIL_FROM="Nha Cho Sinh Vien" <noreply@domain.com>
```

> Lưu ý: không commit `.env` lên Git. Lưu secrets ở nơi an toàn.

## 7) MongoDB — xem & quản lý dữ liệu

- Xác định `MONGODB_URI` trong `d:\DACN\Backend\.env`.
- Dùng MongoDB Compass (GUI) để kết nối và duyệt collections.

Sử dụng `mongosh` (CLI):

```powershell
mongosh "mongodb://localhost:27017"
use nha-cho-sinh-vien
show collections
db.posts.find().limit(5).pretty()
```

Backup & Restore (mongodump / mongorestore):

```powershell
mongodump --uri="mongodb://localhost:27017/nha-cho-sinh-vien" --out d:\backups\dump-$(Get-Date -Format yyyyMMdd)
mongorestore --uri="mongodb://localhost:27017" d:\backups\dump-YYYYMMDD\nha-cho-sinh-vien
```

## 8) Troubleshooting nhanh

- Lỗi kết nối MongoDB: kiểm tra `MONGODB_URI` và đảm bảo MongoDB đang chạy.
- Lỗi upload: kiểm tra quyền ghi của `Backend/uploads` và xem logs server.
- Lỗi CORS: kiểm tra `FRONTEND_URL` trong `Backend/.env`.

## 9) Reset dữ liệu dev (cẩn thận)

```powershell
mongosh "mongodb://localhost:27017" --eval "use nha-cho-sinh-vien; db.dropDatabase();"
```

## 10) Tuỳ chọn nâng cao

- Dùng Docker để chạy MongoDB: `docker run -d --name mongodb -p 27017:27017 mongo:6`
- Dùng MongoDB Atlas cho production (cập nhật `MONGODB_URI` theo dạng `mongodb+srv://...`).

## 11) Kiểm tra nhanh sau khi chạy

- `http://localhost:5000/api/health` — trạng thái server
- `http://localhost:5000/uploads/<filename>` — xem file upload
- `http://localhost:3000` — giao diện frontend
- Đăng nhập với một tài khoản test ở trên để thử chức năng.

---

**Tóm tắt nhanh:** Copy các lệnh dưới đây vào 2 terminal riêng biệt:

**Terminal 1 (Backend):**

```powershell
cd d:\DACN\Backend
npm install
Copy-Item .env.example .env
npm run seed
npm run dev
```

**Terminal 2 (Frontend):**

```powershell
cd d:\DACN\Frontent
npm install
Copy-Item .env.example .env
npm start
```

Sau đó mở `http://localhost:3000` và đăng nhập với email `student1@example.com`, password `student123456`.
