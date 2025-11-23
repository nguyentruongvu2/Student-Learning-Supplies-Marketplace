const mongoose = require("mongoose");

const warningSchema = new mongoose.Schema(
  {
    // Người dùng bị cảnh báo
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Báo cáo liên quan
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },

    // Admin đã xử lý
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Lý do cảnh báo
    reason: {
      type: String,
      required: true,
    },

    // Phản hồi/mô tả từ admin
    adminResponse: {
      type: String,
      required: true,
    },

    // Trạng thái
    isRead: {
      type: Boolean,
      default: false,
    },

    // Thời gian
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "CANH_BAO" }
);

// Index để tìm kiếm nhanh
warningSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Warning", warningSchema);
