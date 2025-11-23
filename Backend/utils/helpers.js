const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Tạo JWT Token
exports.generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Tạo Token Xác thực
exports.generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Kiểm tra Email hợp lệ
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Kiểm tra Email Sinh viên (ví dụ: xxx@student.edu.vn)
exports.isValidStudentEmail = (email) => {
  const studentEmailRegex =
    /^[a-zA-Z0-9._%+-]+@student\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return studentEmailRegex.test(email);
};

// Lấy Phần mở rộng File
exports.getFileExtension = (filename) => {
  return filename.split(".").pop();
};

// Phân trang Truy vấn
exports.getPaginationParams = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
};

// Xử lý Phản hồi Thành công
exports.sendSuccess = (res, data, message = "Thành công", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Xử lý Phản hồi Lỗi
exports.sendError = (res, message = "Lỗi", statusCode = 400, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error : undefined,
  });
};
