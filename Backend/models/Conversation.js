const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Những người tham gia
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Bài đăng liên quan
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    // Tin nhắn cuối cùng
    lastMessage: String,
    lastMessageAt: Date,

    // Trạng thái
    isActive: {
      type: Boolean,
      default: true,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "TRAO_DOI" }
);

conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ postId: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
