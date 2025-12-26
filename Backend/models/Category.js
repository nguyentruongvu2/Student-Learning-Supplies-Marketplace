const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // Tên danh mục
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },

    // Mô tả
    description: {
      type: String,
      maxlength: 500,
    },

    // Icon hoặc ảnh đại diện
    icon: {
      type: String,
      default: null,
    },

    // Thứ tự hiển thị
    order: {
      type: Number,
      default: 0,
    },

    // Trạng thái
    isActive: {
      type: Boolean,
      default: true,
    },

    // Danh mục cha (cho danh mục con)
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
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
  { collection: "DANH_MUC" }
);

// Index
categorySchema.index({ isActive: 1, order: 1 });
categorySchema.index({ parentId: 1 });

// Virtual cho danh mục con
categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentId",
});

module.exports = mongoose.model("Category", categorySchema);
