const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/auth");
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  lockUnlockUser,
  getUserWarnings,
  markWarningAsRead,
} = require("../controllers/userController");

// @route   GET /api/users/:id
// @desc    Lấy hồ sơ người dùng
// @access  Công khai
router.get("/:id", getUserProfile);

// @route   PUT /api/users/:id
// @desc    Cập nhật hồ sơ người dùng
// @access  Riêng tư
router.put("/:id", authenticate, updateUserProfile);

// @route   GET /api/users
// @desc    Lấy tất cả người dùng (chỉ admin)
// @access  Riêng tư/Quản trị
router.get("/", authenticate, isAdmin, getAllUsers);

// @route   PUT /api/users/:id/lock
// @desc    Khóa/Mở tài khoản người dùng (chỉ admin)
// @access  Riêng tư/Quản trị
router.put("/:id/lock", authenticate, isAdmin, lockUnlockUser);

// @route   GET /api/users/:id/warnings
// @desc    Lấy cảnh báo của người dùng
// @access  Riêng tư
router.get("/:id/warnings", authenticate, getUserWarnings);

// @route   PUT /api/users/:userId/warnings/:warningId/read
// @desc    Đánh dấu cảnh báo đã đọc
// @access  Riêng tư
router.put(
  "/:userId/warnings/:warningId/read",
  authenticate,
  markWarningAsRead
);

module.exports = router;
