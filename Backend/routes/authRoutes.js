const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  register,
  login,
  verifyEmail,
  logout,
} = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Đăng ký người dùng mới
// @access  Công khai
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Đăng nhập người dùng
// @access  Công khai
router.post("/login", login);

// @route   POST /api/auth/verify-email/:token
// @route   GET /api/auth/verify-email/:token
// @desc    Xác thực email người dùng
// @access  Công khai
router.post("/verify-email/:token", verifyEmail);
router.get("/verify-email/:token", verifyEmail);

// @route   POST /api/auth/logout
// @desc    Đăng xuất người dùng
// @access  Riêng tư
router.post("/logout", authenticate, logout);

module.exports = router;
