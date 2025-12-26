const PostType = require("../models/PostType");
// audit logging removed

// Lấy tất cả loại bài đăng
exports.getAllPostTypes = async (req, res) => {
  try {
    const postTypes = await PostType.find()
      .populate("createdBy", "fullName email")
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      thành_công: true,
      postTypes,
    });
  } catch (error) {
    console.error("Error fetching post types:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi lấy danh sách loại bài đăng",
    });
  }
};

// Lấy loại bài đăng theo ID
exports.getPostTypeById = async (req, res) => {
  try {
    const postType = await PostType.findById(req.params.id).populate(
      "createdBy",
      "fullName email"
    );

    if (!postType) {
      return res.status(404).json({
        thành_công: false,
        tin_nhắn: "Không tìm thấy loại bài đăng",
      });
    }

    res.status(200).json({
      thành_công: true,
      postType,
    });
  } catch (error) {
    console.error("Error fetching post type:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi lấy thông tin loại bài đăng",
    });
  }
};

// Tạo loại bài đăng mới
exports.createPostType = async (req, res) => {
  try {
    const { name, code, description, icon, order, isActive, config } = req.body;

    // Kiểm tra code đã tồn tại chưa
    const existingPostType = await PostType.findOne({ code });
    if (existingPostType) {
      return res.status(400).json({
        thành_công: false,
        tin_nhắn: "Mã loại bài đăng đã tồn tại",
      });
    }

    const postType = new PostType({
      name,
      code,
      description,
      icon,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      config: config || {
        requirePrice: true,
        requireExchangeFor: false,
        allowNegotiation: true,
      },
      createdBy: req.user.id,
    });

    await postType.save();

    res.status(201).json({
      thành_công: true,
      tin_nhắn: "Tạo loại bài đăng thành công",
      postType,
    });
  } catch (error) {
    console.error("Error creating post type:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi tạo loại bài đăng",
    });
  }
};

// Cập nhật loại bài đăng
exports.updatePostType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, icon, order, isActive, config } = req.body;

    const postType = await PostType.findById(id);
    if (!postType) {
      return res.status(404).json({
        thành_công: false,
        tin_nhắn: "Không tìm thấy loại bài đăng",
      });
    }

    // Kiểm tra code mới có trùng không
    if (code && code !== postType.code) {
      const existingPostType = await PostType.findOne({ code });
      if (existingPostType) {
        return res.status(400).json({
          thành_công: false,
          tin_nhắn: "Mã loại bài đăng đã tồn tại",
        });
      }
    }

    // Cập nhật
    if (name) postType.name = name;
    if (code) postType.code = code;
    if (description !== undefined) postType.description = description;
    if (icon !== undefined) postType.icon = icon;
    if (order !== undefined) postType.order = order;
    if (isActive !== undefined) postType.isActive = isActive;
    if (config) postType.config = { ...postType.config, ...config };
    postType.updatedAt = Date.now();

    await postType.save();

    res.status(200).json({
      thành_công: true,
      tin_nhắn: "Cập nhật loại bài đăng thành công",
      postType,
    });
  } catch (error) {
    console.error("Error updating post type:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi cập nhật loại bài đăng",
    });
  }
};

// Xóa loại bài đăng
exports.deletePostType = async (req, res) => {
  try {
    const { id } = req.params;

    const postType = await PostType.findById(id);
    if (!postType) {
      return res.status(404).json({
        thành_công: false,
        tin_nhắn: "Không tìm thấy loại bài đăng",
      });
    }

    // Kiểm tra xem có bài đăng nào đang sử dụng loại này không
    const Post = require("../models/Post");
    const postCount = await Post.countDocuments({ postType: postType.code });

    if (postCount > 0) {
      return res.status(400).json({
        thành_công: false,
        tin_nhắn: `Không thể xóa loại bài đăng này vì có ${postCount} bài đăng đang sử dụng`,
      });
    }

    await PostType.findByIdAndDelete(id);

    res.status(200).json({
      thành_công: true,
      tin_nhắn: "Xóa loại bài đăng thành công",
    });
  } catch (error) {
    console.error("Error deleting post type:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi xóa loại bài đăng",
    });
  }
};

// Lấy loại bài đăng active
exports.getActivePostTypes = async (req, res) => {
  try {
    const postTypes = await PostType.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      thành_công: true,
      postTypes,
    });
  } catch (error) {
    console.error("Error fetching active post types:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhắn: "Lỗi khi lấy danh sách loại bài đăng",
    });
  }
};
