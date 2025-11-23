const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  getConversations,
  getMessages,
  sendMessage,
  markMessageAsRead,
  createConversation,
  deleteConversation,
} = require("../controllers/messageController");

// @route   GET /api/messages/conversations
// @desc    Lấy tất cả cuộc trò chuyện của người dùng
// @access  Riêng tư
router.get("/conversations", authenticate, getConversations);

// @route   POST /api/messages/conversations/create
// @desc    Tạo cuộc trò chuyện mới
// @access  Riêng tư
router.post("/conversations/create", authenticate, createConversation);

// @route   DELETE /api/messages/conversations/:id
// @desc    Xóa cuộc trò chuyện
// @access  Riêng tư
router.delete("/conversations/:id", authenticate, deleteConversation);

// @route   GET /api/messages/:conversationId
// @desc    Lấy tin nhắn của một cuộc trò chuyện
// @access  Riêng tư
router.get("/:conversationId", authenticate, getMessages);

// @route   POST /api/messages
// @desc    Gửi tin nhắn
// @access  Riêng tư
router.post("/", authenticate, sendMessage);

// @route   PUT /api/messages/:id/read
// @desc    Đánh dấu tin nhắn là đã đọc
// @access  Riêng tư
router.put("/:id/read", authenticate, markMessageAsRead);

module.exports = router;
