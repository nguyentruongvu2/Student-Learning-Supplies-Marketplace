const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Xác thực JWT Token
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không có token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tìm thấy" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa" });
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Token không hợp lệ", error: error.message });
  }
};

// Kiểm tra xem người dùng có phải admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Cần quyền quản trị viên" });
  }
  next();
};

// Kiểm tra xem người dùng đã xác thực email
exports.isVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ message: "Vui lòng xác thực email trước" });
  }
  next();
};

// Xác thực tùy chọn - Lấy user nếu có token, không bắt buộc
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (error) {
    // Bỏ qua lỗi, không bắt buộc phải có token
    console.log("Optional auth: No valid token");
  }

  next();
};
