const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // Nội dung bình luận
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    // Quan hệ
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    commenterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Bình luận cha (để reply)
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    // Trạng thái
    isApproved: {
      type: Boolean,
      default: true,
    },

    // Reactions - Cảm xúc
    reactions: {
      like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      love: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      haha: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      wow: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      sad: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      angry: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },

    // Legacy likes (giữ để tương thích ngược)
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

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
  { collection: "BINH_LUAN" }
);

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ commenterId: 1 });
commentSchema.index({ parentCommentId: 1 });

module.exports = mongoose.model("Comment", commentSchema);
