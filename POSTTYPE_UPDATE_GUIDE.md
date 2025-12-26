# Hướng Dẫn Cập Nhật PostType - Xóa Trường Màu

## Tóm tắt thay đổi

Đã thực hiện các thay đổi sau:

### 1. **Backend - Database Schema**

- ✅ Xóa trường `color` khỏi PostType model
- ✅ Cập nhật controller để không xử lý trường `color`
- ✅ Thêm logic kiểm tra số lượng bài đăng trước khi xóa PostType
- ✅ Tự động cập nhật `postCount` khi:
  - Duyệt bài đăng (approvePost) → tăng postCount
  - Xóa bài đăng đã duyệt → giảm postCount

### 2. **Frontend - Admin Panel**

- ✅ Xóa cột "Màu" khỏi bảng danh sách
- ✅ Xóa input chọn màu khỏi form thêm/sửa
- ✅ Cập nhật state để không lưu trữ giá trị màu

### 3. **Script Migration**

- ✅ Tạo script `update-posttypes.js` để:
  - Xóa trường `color` khỏi database
  - Cập nhật lại `postCount` chính xác cho tất cả PostType

## Cách chạy Migration

### Bước 1: Chạy script cập nhật database

```bash
cd Backend
node scripts/update-posttypes.js
```

Script sẽ:

- Xóa trường `color` khỏi tất cả PostType trong database
- Đếm số lượng bài đăng thực tế của mỗi PostType
- Cập nhật lại `postCount` chính xác

### Bước 2: Restart server

```bash
# Tắt server hiện tại (Ctrl+C)
# Khởi động lại
npm start
```

### Bước 3: Kiểm tra Frontend

1. Đăng nhập với tài khoản admin
2. Vào trang **Quản lý Loại Bài Đăng**
3. Kiểm tra:
   - Cột "Màu" đã biến mất
   - Số bài đăng hiển thị đúng
   - Form thêm/sửa không còn input màu

## Logic hoạt động mới

### Khi tạo bài đăng mới

- Bài đăng được tạo với status = "cho_duyet"
- **Không tăng** `postCount` của PostType
- Chờ admin duyệt

### Khi admin duyệt bài (approvePost)

- Status chuyển thành "chap_nhan"
- **Tăng** `postCount` của PostType lên 1

### Khi xóa bài đăng

- Nếu bài đã được duyệt (status = "chap_nhan"):
  - **Giảm** `postCount` của PostType xuống 1
- Nếu bài chưa duyệt:
  - Không ảnh hưởng đến `postCount`

### Khi xóa PostType

- Kiểm tra số lượng bài đăng đang sử dụng PostType đó
- **Không cho phép** xóa nếu còn bài đăng
- Hiển thị thông báo: "Không thể xóa loại bài đăng này vì có X bài đăng đang sử dụng"

## Files đã thay đổi

1. `Backend/models/PostType.js` - Xóa schema field `color`
2. `Backend/controllers/postTypeController.js` - Cập nhật CRUD operations
3. `Backend/controllers/postController.js` - Thêm logic cập nhật postCount
4. `Frontent/src/pages/AdminPostTypes.js` - Xóa UI màu sắc
5. `Backend/scripts/update-posttypes.js` - Script migration mới

## Kiểm tra sau khi cập nhật

- [ ] Script migration chạy thành công
- [ ] Trường `color` đã bị xóa khỏi database
- [ ] postCount hiển thị chính xác
- [ ] Không thể xóa PostType có bài đăng
- [ ] Admin panel không hiển thị cột màu
- [ ] Form tạo/sửa không có input màu
- [ ] postCount tự động cập nhật khi duyệt/xóa bài

## Lưu ý

- Dữ liệu cũ trong database vẫn có thể chứa trường `color`, nhưng sẽ bị ignore
- Script migration đã xóa hoàn toàn trường này
- Nếu muốn backup trước khi chạy:
  ```bash
  # Chạy script backup
  .\backup-local-data.ps1
  ```
