const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Nội dung tin nhắn
    content: {
      type: String,
      required: true,
    },
    images: [String],

    // Quan hệ
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Trạng thái
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "TIN_NHAN" }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

module.exports = mongoose.model("Message", messageSchema);
