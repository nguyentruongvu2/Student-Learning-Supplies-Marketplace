const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // Thông tin báo cáo
    title: {
      type: String,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    reason: {
      type: String,
      required: true,
    },

    // Quan hệ
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
      default: "post",
    },

    // Bằng chứng
    evidence: [String],

    // Trạng thái
    status: {
      type: String,
      enum: ["cho_xu_ly", "dang_xem_xet", "da_xu_ly", "bi_loai_bo"],
      default: "cho_xu_ly",
    },

    // Phản hồi từ Admin
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    adminResponse: String,
    action: {
      type: String,
      enum: ["canh_bao", "tam_khoa", "xoa_bai", "khong_hanh_dong"],
      default: "khong_hanh_dong",
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: Date,
  },
  { collection: "BAO_CAO" }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ postId: 1 });
reportSchema.index({ reportedUserId: 1 });

module.exports = mongoose.model("Report", reportSchema);
