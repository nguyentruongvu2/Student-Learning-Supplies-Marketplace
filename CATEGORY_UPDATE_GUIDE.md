# Hướng Dẫn Cập Nhật Category - Xóa Màu & Slug, Tự động đồng bộ PostCount

## 📋 Tóm tắt thay đổi

### 1. **Backend - Database Schema**

#### Category Model

- ✅ Xóa trường `color` (màu sắc)
- ✅ Xóa trường `slug` (URL-friendly name)
- ✅ Giữ lại: `name`, `description`, `icon`, `order`, `isActive`, `parentId`, `postCount`

#### Controller Logic

- ✅ Kiểm tra tên trùng thay vì slug
- ✅ Kiểm tra số lượng bài đăng trước khi xóa Category
- ✅ Tự động cập nhật `postCount` khi:
  - Duyệt bài đăng → tăng postCount của Category
  - Xóa bài đăng đã duyệt → giảm postCount của Category

### 2. **Frontend - Admin Panel**

#### AdminCategories.js

- ✅ Xóa cột "Màu" và "Slug" khỏi bảng
- ✅ Xóa input màu sắc và slug khỏi form
- ✅ Hiển thị số bài đăng theo danh mục
- ✅ Cập nhật state để không lưu trữ color/slug

### 3. **Frontend - CreatePost**

#### Tính năng mới

- ✅ Load danh mục từ API thay vì hardcode
- ✅ Hiển thị icon của danh mục
- ✅ Cho phép người dùng nhập danh mục tùy chỉnh nếu không có trong danh sách
- ✅ Option "✏️ Nhập danh mục khác..." để nhập custom

---

## 🔍 Giải thích về Slug

### Slug là gì?

**Slug** là phiên bản URL-friendly của tên, dùng để tạo URL thân thiện với SEO.

**Ví dụ:**

- Tên: "Đồ điện tử" → Slug: "do-dien-tu"
- Tên: "Quần áo & Thời trang" → Slug: "quan-ao-thoi-trang"

### Tại sao xóa Slug?

1. **Không cần thiết**: Hệ thống dùng `name` trực tiếp để query, không dùng slug cho routing
2. **Đơn giản hóa**: Giảm độ phức tạp khi thêm/sửa category
3. **Tránh lỗi**: Không cần lo về slug trùng lặp hay validate slug

### Khi nào cần Slug?

- ✅ Nếu URL dạng: `/category/do-dien-tu`
- ✅ Nếu cần SEO-friendly URLs
- ✅ Nếu có hệ thống multi-language

---

## 🚀 Cách chạy Migration

### Bước 1: Backup dữ liệu (khuyên dùng)

```bash
# Windows PowerShell
.\backup-local-data.ps1

# Linux/Mac
./backup-local-data.sh
```

### Bước 2: Chạy script cập nhật Category

```bash
cd Backend
node scripts/update-categories.js
```

**Output mong đợi:**

```
✅ Đã kết nối MongoDB

🔄 Đang xóa trường color và slug...
✅ Đã xóa trường color và slug khỏi X Category

🔄 Đang cập nhật postCount...
✅ Sách: 15 bài đăng đã duyệt
✅ Điện tử: 8 bài đăng đã duyệt
✅ Quần áo: 3 bài đăng đã duyệt
...

✅ Hoàn thành cập nhật Category!

📊 Tổng kết:
- Tổng số danh mục: 7
- Tổng số bài đăng đã duyệt: 26
```

### Bước 3: Chạy script cập nhật PostType (nếu chưa chạy)

```bash
node scripts/update-posttypes.js
```

### Bước 4: Restart server

```bash
# Tắt server hiện tại (Ctrl+C)
# Khởi động lại
npm start
```

### Bước 5: Kiểm tra Frontend

1. Đăng nhập với tài khoản admin
2. Vào **Quản lý Danh mục**
   - ✅ Cột "Màu" và "Slug" đã biến mất
   - ✅ Số bài đăng hiển thị chính xác
   - ✅ Form không còn input màu/slug
3. Vào **Tạo bài đăng**
   - ✅ Danh mục load từ database
   - ✅ Có icon hiển thị bên cạnh tên
   - ✅ Có option "Nhập danh mục khác..."
   - ✅ Khi chọn "Nhập danh mục khác", xuất hiện ô input

---

## 🔄 Logic hoạt động mới

### **Khi admin duyệt bài (approvePost)**

```javascript
1. Status bài đăng: "cho_duyet" → "chap_nhan"
2. Tăng postCount của PostType (+1)
3. Tăng postCount của Category (+1) ← MỚI
```

### **Khi xóa bài đăng**

```javascript
IF bài đã được duyệt (status = "chap_nhan"):
  1. Giảm postCount của PostType (-1)
  2. Giảm postCount của Category (-1) ← MỚI
ELSE:
  Không ảnh hưởng đến postCount
```

### **Khi xóa Category**

```javascript
1. Kiểm tra có danh mục con? → Không cho xóa
2. Kiểm tra số bài đăng > 0? → Không cho xóa
3. Hiển thị: "Không thể xóa danh mục này vì có X bài đăng đang sử dụng"
```

### **Khi tạo bài đăng**

```javascript
1. User chọn category từ dropdown (load từ API)
2. Nếu chọn "Nhập danh mục khác":
   - Hiện input text
   - User nhập tên danh mục tùy chỉnh
   - Server lưu với tên đó
3. postCount KHÔNG tăng (vì bài chờ duyệt)
```

---

## 📁 Files đã thay đổi

### Backend

1. `Backend/models/Category.js` - Xóa schema fields: `color`, `slug`
2. `Backend/controllers/categoryController.js` - Cập nhật CRUD logic
3. `Backend/controllers/postController.js` - Thêm sync postCount cho Category
4. `Backend/scripts/update-categories.js` - Script migration mới

### Frontend

5. `Frontent/src/pages/AdminCategories.js` - Xóa UI màu & slug
6. `Frontent/src/pages/CreatePost.js` - Load categories từ API, cho phép custom input

---

## ✅ Checklist kiểm tra

### Backend

- [ ] Script migration chạy thành công
- [ ] Trường `color` và `slug` đã bị xóa khỏi database
- [ ] postCount hiển thị chính xác (chỉ đếm bài đã duyệt)
- [ ] Không thể xóa Category có bài đăng
- [ ] Không thể xóa Category có danh mục con
- [ ] postCount tự động tăng khi duyệt bài
- [ ] postCount tự động giảm khi xóa bài đã duyệt

### Frontend - Admin

- [ ] Bảng Category không hiển thị cột "Màu" và "Slug"
- [ ] Form thêm/sửa không có input màu và slug
- [ ] Số bài đăng hiển thị đúng
- [ ] Thông báo lỗi rõ ràng khi xóa Category có bài đăng

### Frontend - CreatePost

- [ ] Danh mục load từ API thành công
- [ ] Icon hiển thị bên cạnh tên danh mục
- [ ] Option "Nhập danh mục khác..." hoạt động
- [ ] Input custom category xuất hiện khi chọn "Nhập danh mục khác"
- [ ] Có thể tạo bài với category custom
- [ ] Validation hoạt động đúng

---

## 🔧 Xử lý lỗi thường gặp

### Lỗi: "Cannot read property 'name' of null"

**Nguyên nhân:** Category bị xóa nhưng Post vẫn reference
**Giải pháp:** Chạy script để update lại postCount và loại bỏ reference không hợp lệ

### Lỗi: "Duplicate key error"

**Nguyên nhân:** Tên category bị trùng
**Giải pháp:** Đảm bảo tên category unique trong database

### Danh mục không load trong CreatePost

**Nguyên nhân:** API `/categories/active` lỗi hoặc không có danh mục active
**Giải pháp:**

1. Kiểm tra console log
2. Đảm bảo có ít nhất 1 category với `isActive: true`
3. Kiểm tra CORS settings

---

## 📊 So sánh trước và sau

### Trước

```javascript
// Category Model
{
  name: "Đồ điện tử",
  slug: "do-dien-tu",        // ❌ Không cần
  color: "#3b82f6",          // ❌ Không cần
  postCount: 0,              // ❌ Không chính xác
}

// CreatePost - Hardcoded
<option value="Sách">Sách</option>
<option value="Quần áo">Quần áo</option>
```

### Sau

```javascript
// Category Model
{
  name: "Đồ điện tử",
  icon: "💻",
  postCount: 8,              // ✅ Tự động đồng bộ
}

// CreatePost - Dynamic từ API
{categories.map(cat => (
  <option value={cat.name}>
    {cat.icon} {cat.name}
  </option>
))}
<option value="custom">✏️ Nhập danh mục khác...</option>
```

---

## 🎯 Lợi ích

1. **Đơn giản hóa**: Ít field hơn = ít lỗi hơn
2. **Linh hoạt**: User có thể tự nhập category
3. **Chính xác**: postCount luôn đúng với số bài đã duyệt
4. **Tự động**: Không cần admin update manually
5. **An toàn**: Không cho xóa category đang sử dụng

---

## 📝 Notes

- Chỉ bài đăng có `status: "chap_nhan"` mới được tính vào postCount
- Category custom do user nhập sẽ không có icon (có thể thêm sau)
- Có thể thêm chức năng admin approve category custom nếu cần
