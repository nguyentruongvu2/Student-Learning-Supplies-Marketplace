/\*\*

- HƯỚNG DẪN KIỂM TRA VÀ SỬA LỖI
- ================================
  \*/

// 1. KIỂM TRA API CONNECTION
export const apiChecklist = {
// Kiểm tra backend chạy trên port 5000
backendURL: "http://localhost:5000",
apiURL: "http://localhost:5000/api",

// Kiểm tra các endpoint chính
endpoints: {
auth: "/auth/login, /auth/register, /auth/verify-email/:token",
posts: "/posts, /posts/:id, /posts/user/my-posts",
users: "/users/:id, /users/:id/profile",
comments: "/comments/:postId, POST /comments",
messages: "/messages/conversations, /messages/:conversationId",
reports: "/reports, GET /reports",
},

// Kiểm tra middleware
middleware: [
"JWT Authentication",
"CORS headers",
"Body parser (JSON/FormData)",
"Error handling",
],
};

// 2. KIỂM TRA FRONTEND CONNECTION
export const frontendChecklist = {
// Kiểm tra localStorage
localStorage: ["token", "user"],

// Kiểm tra environment variables
env: [
"REACT_APP_API_URL=http://localhost:5000/api",
"REACT_APP_SOCKET_URL=http://localhost:5000",
],

// Kiểm tra npm packages
packages: [
"react-router-dom",
"axios",
"react-toastify",
"socket.io-client",
"tailwindcss",
"react-icons",
],
};

// 3. EDGE CASES CẦN KIỂM TRA
export const edgeCases = [
"Người dùng không đăng nhập → Redirect /login",
"Token hết hạn → Clear localStorage, redirect /login",
"API lỗi → Hiển thị fallback data",
"Network offline → Toast error",
"Upload ảnh thất bại → Toast error, fallback URL",
"Xóa bài đăng → Confirm dialog",
"Tạo bài đăng → Validate form trước khi submit",
"Gửi tin nhắn → Không cho gửi trống",
"Chuyển trang → Scroll to top",
];

// 4. CẢI THIỆN HIỆU SUẤT
export const performanceOptimization = [
"Sử dụng React.memo() cho components không thường xuyên thay đổi",
"Sử dụng useMemo() và useCallback() cho computed values",
"Lazy load images",
"Code splitting với React.lazy()",
"Minify CSS/JS trong production",
"Sử dụng virtual scrolling cho lists dài",
"Cache API responses",
"Debounce search input",
];

// 5. SECURITY BEST PRACTICES
export const securityPractices = [
"Không lưu sensitive data (password) vào localStorage",
"Luôn sử dụng HTTPS trong production",
"Validate input trên frontend và backend",
"CSRF protection",
"Rate limiting trên API",
"Sanitize HTML/user input",
"Implement logout function",
"Check token expiration",
];

// 6. RESPONSIVE DESIGN
export const responsiveBreakpoints = {
mobile: "max-w-xs (< 640px)",
tablet: "max-w-md to max-w-lg (640px - 1024px)",
desktop: "max-w-7xl (> 1024px)",
};

// 7. TESTING CHECKLIST
export const testingChecklist = {
authentication: [
"Login thành công",
"Login sai email/password",
"Register thành công",
"Register duplicate email",
"Email verification",
"Logout",
],

posts: [
"Tạo bài đăng",
"Xem tất cả bài đăng",
"Xem chi tiết bài đăng",
"Chỉnh sửa bài đăng",
"Xóa bài đăng",
"Lưu bài đăng",
"Tìm kiếm bài đăng",
"Filter bài đăng",
],

comments: [
"Thêm bình luận",
"Xóa bình luận",
"Like bình luận",
"Rating bài đăng qua bình luận",
],

chat: [
"Tạo cuộc trò chuyện",
"Gửi tin nhắn",
"Nhận tin nhắn real-time",
"Typing indicator",
],

admin: [
"Xem danh sách bài đăng chờ duyệt",
"Duyệt bài đăng",
"Từ chối bài đăng",
"Xem báo cáo",
"Xử lý báo cáo",
],
};

// 8. DEPLOYMENT CHECKLIST
export const deploymentChecklist = [
"Build production: npm run build",
"Test trước deploy: npm start",
"Cấu hình .env cho production",
"Kiểm tra CORS settings trên backend",
"Database backup",
"SSL certificate (HTTPS)",
"CDN configuration",
"Monitoring & logging setup",
"Error tracking (e.g., Sentry)",
];

/\*\*

- LỆNH KIỂM TRA NHANH
- ==================
-
- # Kiểm tra backend
- curl http://localhost:5000/api/posts
-
- # Kiểm tra Socket.io
- curl http://localhost:5000/socket.io/
-
- # Build frontend
- npm run build
-
- # Test production build
- npx serve -s build
-
- # Kiểm tra performance
- npm run build --analyze
  \*/
