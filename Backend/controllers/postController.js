const Post = require("../models/Post");
const User = require("../models/User");
const { getPaginationParams } = require("../utils/helpers");

// @desc    Lấy tất cả bài đăng với lọc và tìm kiếm
// @route   GET /api/posts
// @access  Công khai
exports.getAllPosts = async (req, res) => {
  try {
    const {
      category,
      postType,
      search,
      sort,
      page,
      limit,
      status,
      priceMin,
      priceMax,
      dateFilter,
      conditions,
      negotiableOnly,
    } = req.query;

    const { skip, lim, pageNum } = getPaginationParams(page, limit);

    let query = {};

    // Nếu có query status thì dùng, không thì chỉ lấy bài đã duyệt
    if (status) {
      query.status = status;
    } else {
      query.status = "chap_nhan"; // Chỉ lấy bài đã duyệt
    }

    // Lọc theo loại bài
    if (postType) query.postType = postType;

    // Lọc theo danh mục
    if (category) query.category = category;

    // Lọc theo khoảng giá
    if (priceMin !== undefined || priceMax !== undefined) {
      query.price = {};
      if (priceMin !== undefined && priceMin !== "null") {
        query.price.$gte = Number(priceMin);
      }
      if (priceMax !== undefined && priceMax !== "null") {
        query.price.$lte = Number(priceMax);
      }
    }

    // Lọc theo tình trạng
    if (conditions) {
      const conditionArray = conditions.split(",").map((c) => c.trim());
      if (conditionArray.length > 0) {
        query.condition = { $in: conditionArray };
      }
    }

    // Lọc chỉ giá có thể thương lượng
    if (negotiableOnly === "true") {
      query.negotiable = true;
    }

    // Lọc theo thời gian đăng
    if (dateFilter) {
      const now = new Date();
      let startDate;

      switch (dateFilter) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
      }

      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    // Tìm kiếm theo tiêu đề và mô tả
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    console.log("📊 getAllPosts Query:", JSON.stringify(query));
    console.log("🔍 Search term:", search);

    // Sắp xếp
    let sortOption = { createdAt: -1 }; // Mặc định: mới nhất

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "most_viewed":
        sortOption = { viewCount: -1 };
        break;
      case "most_saved":
        sortOption = { saveCount: -1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1 };
    }

    const posts = await Post.find(query)
      .populate("sellerId", "fullName avatar rating")
      .skip(skip)
      .limit(lim)
      .sort(sortOption);

    const total = await Post.countDocuments(query);

    console.log(`✅ Found ${posts.length} posts (Total: ${total})`);
    if (posts.length > 0) {
      console.log("First post:", {
        id: posts[0]._id,
        title: posts[0].title,
        status: posts[0].status,
      });
    }

    res.status(200).json({
      thành_công: true,
      dữ_liệu: posts,
      trang_hiện_tại: pageNum,
      tổng_trang: Math.ceil(total / lim),
      tổng_số: total,
    });
  } catch (error) {
    console.error("Lỗi lấy tất cả bài:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Lấy chi tiết bài đăng
// @route   GET /api/posts/:id
// @access  Công khai
exports.getPostDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id; // Từ auth middleware (nếu đăng nhập)

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate("sellerId", "fullName avatar rating email phone");

    if (!post) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Bài đăng không tồn tại",
      });
    }

    // Kiểm tra xem user đã lưu bài đăng này chưa
    let isSaved = false;
    if (userId) {
      const User = require("../models/User");
      const user = await User.findById(userId);
      if (user) {
        // Khởi tạo savedPosts nếu chưa có
        if (!user.savedPosts) {
          user.savedPosts = [];
          await user.save();
        }
        isSaved = user.savedPosts.some((postId) => postId.toString() === id);
      }
    }

    // Thêm isSaved vào response
    const postData = post.toObject();
    postData.isSaved = isSaved;

    res.status(200).json({
      thành_công: true,
      dữ_liệu: postData,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết bài:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Tạo bài đăng mới
// @route   POST /api/posts
// @access  Riêng tư/Đã xác thực
exports.createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      postType,
      price,
      condition,
      location,
      images,
    } = req.body;
    const sellerId = req.user._id;

    // Xác thực dữ liệu
    if (
      !title ||
      !description ||
      !category ||
      !postType ||
      !condition ||
      !location
    ) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan:
          "Vui lòng cung cấp tất cả các trường bắt buộc (title, description, category, postType, condition, location)",
      });
    }

    // Kiểm tra giá cho bài bán
    if (postType === "ban" && !price) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Vui lòng cung cấp giá cho bài bán",
      });
    }

    const post = new Post({
      title,
      description,
      category,
      postType,
      price: postType === "ban" ? price : null,
      condition,
      location,
      images: images || [],
      sellerId,
      status: "cho_duyet", // Chờ duyệt từ admin
    });

    await post.save();

    // Tăng số bài đăng của người dùng
    await User.findByIdAndUpdate(sellerId, { $inc: { postsCount: 1 } });

    // Không tăng postCount ở PostType vì bài đang chờ duyệt
    // postCount chỉ tăng khi bài được duyệt (approvePost)

    res.status(201).json({
      thành_công: true,
      tin_nhan: "Bài đăng đã được tạo thành công. Chờ quản trị viên duyệt",
      dữ_liệu: post,
    });
  } catch (error) {
    console.error("Lỗi tạo bài:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Cập nhật bài đăng
// @route   PUT /api/posts/:id
// @access  Riêng tư
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Bài đăng không tồn tại",
      });
    }

    // Kiểm tra quyền
    if (
      post.sellerId.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Bạn không có quyền cập nhật bài này",
      });
    }

    // Cập nhật các trường được phép
    const { title, description, category, price, condition, location, images } =
      req.body;
    if (title) post.title = title;
    if (description) post.description = description;
    if (category) post.category = category;
    if (price) post.price = price;
    if (condition) post.condition = condition;
    if (location) post.location = location;
    if (images) post.images = images;

    post.updatedAt = Date.now();
    await post.save();

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Bài đăng đã được cập nhật thành công",
      dữ_liệu: post,
    });
  } catch (error) {
    console.error("Lỗi cập nhật bài:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Xóa bài đăng
// @route   DELETE /api/posts/:id
// @access  Riêng tư
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Bài đăng không tồn tại",
      });
    }

    // Kiểm tra quyền
    if (
      post.sellerId.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Bạn không có quyền xóa bài này",
      });
    }

    await Post.findByIdAndDelete(id);

    // Giảm số bài đăng của người dùng
    await User.findByIdAndUpdate(post.sellerId, { $inc: { postsCount: -1 } });

    // Giảm postCount của PostType nếu bài đã được duyệt
    if (post.status === "chap_nhan") {
      const PostType = require("../models/PostType");
      await PostType.findOneAndUpdate(
        { code: post.postType },
        { $inc: { postCount: -1 } }
      );

      // Giảm postCount của Category nếu bài đã được duyệt
      const Category = require("../models/Category");
      await Category.findOneAndUpdate(
        { name: post.category },
        { $inc: { postCount: -1 } }
      );
    }

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Bài đăng đã được xóa thành công",
    });
  } catch (error) {
    console.error("Lỗi xóa bài:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Lưu bài đăng
// @route   POST /api/posts/:id/save
// @access  Riêng tư
exports.savePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Bài đăng không tồn tại",
      });
    }

    const User = require("../models/User");
    const user = await User.findById(userId);

    // Khởi tạo savedPosts nếu chưa có
    if (!user.savedPosts) {
      user.savedPosts = [];
    }

    // Kiểm tra đã lưu chưa
    const isSavedInPost = post.savedBy.includes(userId);
    const isSavedInUser = user.savedPosts.some(
      (postId) => postId.toString() === id
    );

    console.log("💾 SavePost Debug:", {
      userId: userId.toString(),
      postId: id,
      isSavedInPost,
      isSavedInUser,
      savedPostsLength: user.savedPosts.length,
      savedByLength: post.savedBy.length,
    });

    if (isSavedInPost || isSavedInUser) {
      // Bỏ lưu
      post.savedBy = post.savedBy.filter(
        (uid) => uid.toString() !== userId.toString()
      );
      user.savedPosts = user.savedPosts.filter(
        (postId) => postId.toString() !== id
      );
      await post.save();
      await user.save();

      return res.status(200).json({
        thành_công: true,
        tin_nhan: "Đã bỏ lưu bài đăng",
        dữ_liệu: post,
      });
    } else {
      // Lưu
      post.savedBy.push(userId);
      user.savedPosts.push(id);
      await post.save();
      await user.save();

      return res.status(200).json({
        thành_công: true,
        tin_nhan: "Đã lưu bài đăng",
        dữ_liệu: post,
      });
    }
  } catch (error) {
    console.error("Lỗi lưu bài:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Lấy danh sách bài đăng đã lưu
// @route   GET /api/posts/saved
// @access  Riêng tư
exports.getSavedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;
    const { skip, lim, pageNum } = getPaginationParams(page, limit);

    // Lấy danh sách bài đăng từ user.savedPosts
    const User = require("../models/User");
    const user = await User.findById(userId);

    // Khởi tạo savedPosts nếu chưa có
    if (!user.savedPosts) {
      user.savedPosts = [];
      await user.save();
    }

    if (!user || !user.savedPosts || user.savedPosts.length === 0) {
      return res.status(200).json({
        thành_công: true,
        dữ_liệu: [],
        trang_hiện_tại: pageNum,
        tổng_trang: 0,
        tổng_số: 0,
      });
    }

    const posts = await Post.find({
      _id: { $in: user.savedPosts },
      status: "chap_nhan", // Chỉ lấy bài đã duyệt
    })
      .populate("sellerId", "fullName avatar rating")
      .skip(skip)
      .limit(lim)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({
      savedBy: userId,
      status: "chap_nhan",
    });

    res.status(200).json({
      thành_công: true,
      dữ_liệu: posts,
      trang_hiện_tại: pageNum,
      tổng_trang: Math.ceil(total / lim),
      tổng_số: total,
    });
  } catch (error) {
    console.error("Lỗi lấy bài đăng đã lưu:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Lấy bài đăng của user hiện tại
// @route   GET /api/posts/user/my-posts
// @access  Riêng tư
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit, status } = req.query;
    const { skip, lim, pageNum } = getPaginationParams(page, limit);

    let query = { sellerId: userId };

    // Filter theo status nếu có
    if (status) {
      query.status = status;
    }

    const posts = await Post.find(query)
      .populate("sellerId", "fullName avatar")
      .skip(skip)
      .limit(lim)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

    res.status(200).json({
      thành_công: true,
      dữ_liệu: posts,
      trang_hiện_tại: pageNum,
      tổng_trang: Math.ceil(total / lim),
      tổng_số: total,
    });
  } catch (error) {
    console.error("Lỗi lấy bài đăng của user:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Duyệt bài đăng (chỉ admin)
// @route   PUT /api/posts/:id/approve
// @access  Riêng tư/Quản trị
exports.approvePost = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`✅ Approving post: ${id}`);

    const post = await Post.findByIdAndUpdate(
      id,
      { status: "chap_nhan", updatedAt: Date.now() },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Bài đăng không tồn tại",
      });
    }

    // Tăng postCount của PostType khi duyệt bài
    const PostType = require("../models/PostType");
    await PostType.findOneAndUpdate(
      { code: post.postType },
      { $inc: { postCount: 1 } }
    );

    // Tăng postCount của Category khi duyệt bài
    const Category = require("../models/Category");
    await Category.findOneAndUpdate(
      { name: post.category },
      { $inc: { postCount: 1 } }
    );

    console.log(`✅ Post approved:`, {
      id: post._id,
      title: post.title,
      status: post.status,
    });

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Bài đăng đã được duyệt thành công",
      dữ_liệu: post,
    });
  } catch (error) {
    console.error("Lỗi duyệt bài:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Từ chối bài đăng (chỉ admin)
// @route   PUT /api/posts/:id/reject
// @access  Riêng tư/Quản trị
exports.rejectPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const post = await Post.findByIdAndUpdate(
      id,
      { status: "tu_choi", rejectionReason: reason, updatedAt: Date.now() },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Bài đăng không tồn tại",
      });
    }

    // Không cần giảm postCount vì bài chưa được duyệt nên chưa tăng postCount

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Bài đăng đã bị từ chối",
      dữ_liệu: post,
    });
  } catch (error) {
    console.error("Lỗi từ chối bài:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};
