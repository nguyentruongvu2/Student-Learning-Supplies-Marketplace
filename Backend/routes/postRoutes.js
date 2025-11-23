const express = require("express");
const router = express.Router();
const {
  authenticate,
  isAdmin,
  isVerified,
  optionalAuth,
} = require("../middleware/auth");
const {
  getAllPosts,
  getPostDetail,
  createPost,
  updatePost,
  deletePost,
  savePost,
  getSavedPosts,
  getUserPosts,
  approvePost,
  rejectPost,
} = require("../controllers/postController");

// @route   GET /api/posts
// @desc    Lấy tất cả bài đăng với lọc và tìm kiếm
// @access  Công khai
router.get("/", getAllPosts);

// @route   GET /api/posts/saved
// @desc    Lấy danh sách bài đăng đã lưu
// @access  Riêng tư
router.get("/saved", authenticate, getSavedPosts);

// @route   GET /api/posts/user/my-posts
// @desc    Lấy bài đăng của user hiện tại
// @access  Riêng tư
router.get("/user/my-posts", authenticate, getUserPosts);

// @route   GET /api/posts/:id
// @desc    Lấy chi tiết bài đăng
// @access  Công khai (với optional auth để check isSaved)
router.get("/:id", optionalAuth, getPostDetail);

// @route   POST /api/posts
// @desc    Tạo bài đăng mới
// @access  Riêng tư/Đã xác thực
router.post("/", authenticate, isVerified, createPost);

// @route   PUT /api/posts/:id
// @desc    Cập nhật bài đăng
// @access  Riêng tư
router.put("/:id", authenticate, updatePost);

// @route   DELETE /api/posts/:id
// @desc    Xóa bài đăng
// @access  Riêng tư
router.delete("/:id", authenticate, deletePost);

// @route   POST /api/posts/:id/save
// @desc    Lưu bài đăng
// @access  Riêng tư
router.post("/:id/save", authenticate, savePost);

// @route   PUT /api/posts/:id/approve
// @desc    Duyệt bài đăng (chỉ admin)
// @access  Riêng tư/Quản trị
router.put("/:id/approve", authenticate, isAdmin, approvePost);

// @route   PUT /api/posts/:id/reject
// @desc    Từ chối bài đăng (chỉ admin)
// @access  Riêng tư/Quản trị
router.put("/:id/reject", authenticate, isAdmin, rejectPost);

module.exports = router;
