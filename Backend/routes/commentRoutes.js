const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  reactToComment,
} = require("../controllers/commentController");

// @route   GET /api/comments/:postId
// @desc    Lấy tất cả bình luận của một bài đăng
// @access  Công khai
router.get("/:postId", getComments);

// @route   POST /api/comments
// @desc    Tạo bình luận mới
// @access  Riêng tư
router.post("/", authenticate, createComment);

// @route   PUT /api/comments/:id
// @desc    Cập nhật bình luận
// @access  Riêng tư
router.put("/:id", authenticate, updateComment);

// @route   DELETE /api/comments/:id
// @desc    Xóa bình luận
// @access  Riêng tư
router.delete("/:id", authenticate, deleteComment);

// @route   POST /api/comments/:id/like
// @desc    Thích bình luận
// @access  Riêng tư
router.post("/:id/like", authenticate, likeComment);

// @route   POST /api/comments/:id/react
// @desc    Thêm/xóa reaction cho bình luận
// @access  Riêng tư
router.post("/:id/react", authenticate, reactToComment);

module.exports = router;
