const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  // Người thực hiện hành động
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Loại hành động
  action: {
    type: String,
    required: true,
    enum: [
      "login",
      "logout",
      "register",
      "create_post",
      "update_post",
      "delete_post",
      "approve_post",
      "reject_post",
      "create_comment",
      "delete_comment",
      "create_report",
      "handle_report",
      "lock_user",
      "unlock_user",
      "warn_user",
      "send_message",
      "other",
    ],
  },

  // Mô tả chi tiết
  description: {
    type: String,
    required: true,
  },

  // IP address
  ipAddress: {
    type: String,
  },

  // User agent (browser info)
  userAgent: {
    type: String,
  },

  // Đối tượng liên quan (post ID, comment ID, user ID...)
  targetId: {
    type: String,
  },

  // Loại đối tượng
  targetType: {
    type: String,
    enum: ["post", "comment", "user", "report", "message", "other"],
  },

  // Metadata bổ sung (flexible JSON)
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },

  // Thời gian
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index để tìm kiếm nhanh
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ targetId: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
