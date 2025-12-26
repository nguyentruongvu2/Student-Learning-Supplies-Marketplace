const Category = require("../models/Category");
// audit logging removed

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("createdBy", "fullName email")
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      thành_công: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi lấy danh sách danh mục",
    });
  }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "createdBy",
      "fullName email"
    );

    if (!category) {
      return res.status(404).json({
        thành_công: false,
        tin_nhắn: "Không tìm thấy danh mục",
      });
    }

    res.status(200).json({
      thành_công: true,
      category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi lấy thông tin danh mục",
    });
  }
};

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon, order, isActive, parentId } = req.body;

    // Kiểm tra tên đã tồn tại chưa
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        thành_công: false,
        tin_nhắn: "Tên danh mục đã tồn tại",
      });
    }

    const category = new Category({
      name,
      description,
      icon,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      parentId: parentId || null,
      createdBy: req.user.id,
    });

    await category.save();

    res.status(201).json({
      thành_công: true,
      tin_nhắn: "Tạo danh mục thành công",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi tạo danh mục",
    });
  }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, order, isActive, parentId } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        thành_công: false,
        tin_nhắn: "Không tìm thấy danh mục",
      });
    }

    // Kiểm tra tên mới có trùng không
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          thành_công: false,
          tin_nhắn: "Tên danh mục đã tồn tại",
        });
      }
    }

    // Cập nhật
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;
    if (parentId !== undefined) category.parentId = parentId;
    category.updatedAt = Date.now();

    await category.save();

    res.status(200).json({
      thành_công: true,
      tin_nhắn: "Cập nhật danh mục thành công",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi cập nhật danh mục",
    });
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        thành_công: false,
        tin_nhắn: "Không tìm thấy danh mục",
      });
    }

    // Kiểm tra xem có danh mục con không
    const hasChildren = await Category.findOne({ parentId: id });
    if (hasChildren) {
      return res.status(400).json({
        thành_công: false,
        tin_nhắn: "Không thể xóa danh mục có danh mục con",
      });
    }

    // Kiểm tra xem có bài đăng nào đang sử dụng danh mục này không
    const Post = require("../models/Post");
    const postCount = await Post.countDocuments({ category: category.name });

    if (postCount > 0) {
      return res.status(400).json({
        thành_công: false,
        tin_nhắn: `Không thể xóa danh mục này vì có ${postCount} bài đăng đang sử dụng`,
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      thành_công: true,
      tin_nhắn: "Xóa danh mục thành công",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi xóa danh mục",
    });
  }
};

// Lấy danh mục active
exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      thành_công: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching active categories:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi lấy danh sách danh mục",
    });
  }
};
