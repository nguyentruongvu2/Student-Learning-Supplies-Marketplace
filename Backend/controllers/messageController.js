const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { getPaginationParams } = require("../utils/helpers");

// @desc    Lấy tất cả cuộc trò chuyện của người dùng
// @route   GET /api/messages/conversations
// @access  Riêng tư
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;
    const { skip, lim, pageNum } = getPaginationParams(page, limit);

    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "fullName avatar")
      .populate("postId", "title")
      .skip(skip)
      .limit(lim)
      .sort({ lastMessageAt: -1 });

    const total = await Conversation.countDocuments({ participants: userId });

    res.status(200).json({
      thành_công: true,
      dữ_liệu: conversations,
      trang_hiện_tại: pageNum,
      tổng_trang: Math.ceil(total / lim),
      tổng_số: total,
    });
  } catch (error) {
    console.error("Lỗi lấy cuộc trò chuyện:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Lấy tin nhắn của một cuộc trò chuyện
// @route   GET /api/messages/:conversationId
// @access  Riêng tư
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page, limit } = req.query;
    const { skip, lim, pageNum } = getPaginationParams(page, limit);
    const userId = req.user._id;

    // Kiểm tra người dùng có quyền truy cập cuộc trò chuyện này
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Bạn không có quyền truy cập cuộc trò chuyện này",
      });
    }

    const messages = await Message.find({ conversationId })
      .populate("senderId", "fullName avatar")
      .skip(skip)
      .limit(lim)
      .sort({ createdAt: 1 });

    const total = await Message.countDocuments({ conversationId });

    res.status(200).json({
      thành_công: true,
      dữ_liệu: messages,
      trang_hiện_tại: pageNum,
      tổng_trang: Math.ceil(total / lim),
      tổng_số: total,
    });
  } catch (error) {
    console.error("Lỗi lấy tin nhắn:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Gửi tin nhắn
// @route   POST /api/messages
// @access  Riêng tư
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content, images } = req.body;
    const senderId = req.user._id;

    // Xác thực dữ liệu
    if (!conversationId || !content) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Vui lòng cung cấp tất cả các trường bắt buộc",
      });
    }

    // Kiểm tra cuộc trò chuyện tồn tại
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Cuộc trò chuyện không tồn tại",
      });
    }

    // Kiểm tra người dùng có quyền gửi tin nhắn
    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này",
      });
    }

    // Tạo tin nhắn
    const message = new Message({
      conversationId,
      senderId,
      content,
      images: images || [],
    });

    await message.save();

    // Cập nhật cuộc trò chuyện
    conversation.lastMessageAt = Date.now();
    conversation.isActive = true;
    await conversation.save();

    res.status(201).json({
      thành_công: true,
      tin_nhan: "Tin nhắn đã được gửi",
      dữ_liệu: await message.populate("senderId", "fullName avatar"),
    });
  } catch (error) {
    console.error("Lỗi gửi tin nhắn:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Đánh dấu tin nhắn là đã đọc
// @route   PUT /api/messages/:id/read
// @access  Riêng tư
exports.markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findByIdAndUpdate(
      id,
      {
        isRead: true,
        readAt: Date.now(),
      },
      { new: true }
    ).populate("senderId", "fullName avatar");

    if (!message) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Tin nhắn không tồn tại",
      });
    }

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Tin nhắn đã được đánh dấu là đã đọc",
      dữ_liệu: message,
    });
  } catch (error) {
    console.error("Lỗi đánh dấu đã đọc:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Tạo cuộc trò chuyện mới
// @route   POST /api/messages/conversations/create
// @access  Riêng tư
exports.createConversation = async (req, res) => {
  try {
    const { participantId, relatedPostId } = req.body;
    const userId = req.user._id;

    // Xác thực dữ liệu
    if (!participantId) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Vui lòng cung cấp ID người tham gia",
      });
    }

    // Kiểm tra cuộc trò chuyện đã tồn tại giữa hai người
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
    });

    if (conversation) {
      return res.status(200).json({
        thành_công: true,
        tin_nhan: "Cuộc trò chuyện đã tồn tại",
        dữ_liệu: conversation,
      });
    }

    // Tạo cuộc trò chuyện mới
    conversation = new Conversation({
      participants: [userId, participantId],
      postId: relatedPostId || null,
    });

    await conversation.save();

    res.status(201).json({
      thành_công: true,
      tin_nhan: "Cuộc trò chuyện đã được tạo",
      dữ_liệu: await conversation.populate([
        { path: "participants", select: "fullName avatar" },
        { path: "postId", select: "title" },
      ]),
    });
  } catch (error) {
    console.error("Lỗi tạo cuộc trò chuyện:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Xóa cuộc trò chuyện
// @route   DELETE /api/messages/conversations/:id
// @access  Riêng tư
exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Cuộc trò chuyện không tồn tại",
      });
    }

    // Kiểm tra người dùng có trong cuộc trò chuyện
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Bạn không có quyền xóa cuộc trò chuyện này",
      });
    }

    // Xóa tất cả tin nhắn trong cuộc trò chuyện
    await Message.deleteMany({ conversationId: id });

    // Xóa cuộc trò chuyện
    await Conversation.findByIdAndDelete(id);

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Đã xóa cuộc trò chuyện",
    });
  } catch (error) {
    console.error("Lỗi xóa cuộc trò chuyện:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Thu hồi tin nhắn
// @route   PUT /api/messages/:messageId/recall
// @access  Riêng tư
exports.recallMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    // Tìm tin nhắn
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Tin nhắn không tồn tại",
      });
    }

    // Kiểm tra người dùng có phải người gửi
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Bạn chỉ có thể thu hồi tin nhắn của mình",
      });
    }

    // Kiểm tra tin nhắn đã được thu hồi chưa
    if (message.isRecalled) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Tin nhắn này đã được thu hồi",
      });
    }

    // Kiểm tra thời gian (có thể chỉ cho phép thu hồi trong 15 phút)
    const fifteenMinutes = 15 * 60 * 1000;
    const messageAge = Date.now() - new Date(message.createdAt).getTime();

    if (messageAge > fifteenMinutes) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Chỉ có thể thu hồi tin nhắn trong vòng 15 phút",
      });
    }

    // Thu hồi tin nhắn
    message.isRecalled = true;
    message.recalledAt = Date.now();
    message.content = "Tin nhắn đã được thu hồi";
    message.images = [];

    await message.save();

    // Emit socket event để cập nhật real-time
    const { io } = require("../server");
    const conversation = await Conversation.findById(message.conversationId);

    if (conversation && io) {
      conversation.participants.forEach((participantId) => {
        io.to(participantId.toString()).emit("message_recalled", {
          messageId: message._id,
          conversationId: message.conversationId,
          message: message,
        });
      });
    }

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Đã thu hồi tin nhắn",
      dữ_liệu: message,
    });
  } catch (error) {
    console.error("Lỗi thu hồi tin nhắn:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};
