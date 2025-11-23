const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // Thông tin bài đăng
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ["Sách", "Bút & Giấy", "Máy tính & Điện tử", "Quần áo", "Khác"],
      required: true,
    },

    // Loại bài đăng
    postType: {
      type: String,
      enum: ["ban", "trao_doi"],
      required: true,
    },

    // Giá (cho bài đăng bán)
    price: {
      type: Number,
      default: null,
    },
    negotiable: {
      type: Boolean,
      default: false,
    },

    // Chi tiết trao đổi (cho bài đăng trao đổi)
    exchangeFor: String,

    // Tình trạng
    condition: {
      type: String,
      enum: ["Mới", "Như mới", "Tốt", "Bình thường", "Cần sửa chữa"],
      required: true,
    },

    // Hình ảnh
    images: [
      {
        type: String,
        default: [],
      },
    ],

    // Thông tin người bán
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Địa điểm
    location: {
      type: String,
      required: true,
    },

    // Trạng thái bài đăng
    status: {
      type: String,
      enum: ["chap_nhan", "cho_duyet", "tu_choi", "da_ban", "het_han"],
      default: "cho_duyet",
    },
    rejectionReason: String,

    // Thống kê
    viewCount: {
      type: Number,
      default: 0,
    },
    saveCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },

    // Engagement
    savedBy: [
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
    expiredAt: Date,
  },
  { collection: "BAI_DANG" }
);

// Index for search and filtering
postSchema.index({ title: "text", description: "text" });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ sellerId: 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
