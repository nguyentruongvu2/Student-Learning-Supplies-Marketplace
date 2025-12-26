const mongoose = require("mongoose");

const postTypeSchema = new mongoose.Schema(
  {
    // Tên loại bài đăng
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },

    // Mã loại (key duy nhất)
    code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Mô tả
    description: {
      type: String,
      maxlength: 500,
    },

    // Icon
    icon: {
      type: String,
      default: null,
    },

    // Trạng thái
    isActive: {
      type: Boolean,
      default: true,
    },

    // Thứ tự hiển thị
    order: {
      type: Number,
      default: 0,
    },

    // Cấu hình hiển thị
    config: {
      requirePrice: {
        type: Boolean,
        default: true,
      },
      requireExchangeFor: {
        type: Boolean,
        default: false,
      },
      allowNegotiation: {
        type: Boolean,
        default: true,
      },
    },

    // Thống kê
    postCount: {
      type: Number,
      default: 0,
    },

    // Người tạo
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
  { collection: "LOAI_BAI_DANG" }
);

// Index
postTypeSchema.index({ code: 1 });
postTypeSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model("PostType", postTypeSchema);
