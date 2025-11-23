const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { getPaginationParams } = require("../utils/helpers");

// @desc    Lấy tất cả bình luận của một bài đăng
// @route   GET /api/comments/:postId
// @access  Công khai
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page, limit } = req.query;
    const { skip, lim, pageNum } = getPaginationParams(page, limit);

    // Lấy comments gốc (không có parentCommentId)
    const comments = await Comment.find({ postId, parentCommentId: null })
      .populate("commenterId", "fullName avatar rating")
      .skip(skip)
      .limit(lim)
      .sort({ createdAt: -1 });

    // Lấy replies cho mỗi comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentCommentId: comment._id })
          .populate("commenterId", "fullName avatar rating")
          .sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies: replies,
          repliesCount: replies.length,
        };
      })
    );

    const total = await Comment.countDocuments({
      postId,
      parentCommentId: null,
    });

    res.status(200).json({
      thành_công: true,
      dữ_liệu: commentsWithReplies,
      trang_hiện_tại: pageNum,
      tổng_trang: Math.ceil(total / lim),
      tổng_số: total,
    });
  } catch (error) {
    console.error("Lỗi lấy bình luận:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Tạo bình luận mới
// @route   POST /api/comments
// @access  Riêng tư
exports.createComment = async (req, res) => {
  try {
    const { postId, content, rating, parentCommentId } = req.body;
    const commenterId = req.user._id;

    // Xác thực dữ liệu
    if (!postId || !content) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Vui lòng cung cấp tất cả các trường bắt buộc",
      });
    }

    // Kiểm tra bài đăng tồn tại
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Bài đăng không tồn tại",
      });
    }

    // Validate rating (1-5)
    let validRating = null;
    if (rating) {
      const ratingNum = parseInt(rating);
      if (ratingNum >= 1 && ratingNum <= 5) {
        validRating = ratingNum;
      }
    }

    // Nếu có parentCommentId, tìm comment gốc (lùi đến khi không còn parentCommentId)
    let rootCommentId = parentCommentId;
    if (parentCommentId) {
      let currentComment = await Comment.findById(parentCommentId);
      // Lùi lại cho đến khi tìm được comment gốc (không có parentCommentId)
      while (currentComment && currentComment.parentCommentId) {
        currentComment = await Comment.findById(currentComment.parentCommentId);
      }
      // Nếu tìm được comment gốc, dùng ID của nó; nếu không thì dùng parentCommentId ban đầu
      rootCommentId = currentComment ? currentComment._id : parentCommentId;
    }

    // Tạo bình luận
    const comment = new Comment({
      postId,
      commenterId,
      content,
      rating: validRating,
      parentCommentId: rootCommentId || null,
    });

    await comment.save();

    // Chỉ tăng commentsCount nếu là comment gốc (không phải reply)
    if (!rootCommentId) {
      post.commentsCount = (post.commentsCount || 0) + 1;
      await post.save();
    }

    // Nếu có rating và là comment gốc (đánh giá người bán), cập nhật rating
    if (validRating && !rootCommentId) {
      const seller = await require("../models/User").findById(post.sellerId);
      if (seller) {
        const currentTotal = seller.totalRatings || 0;
        const currentRating = seller.rating || 0;
        const newTotal = currentTotal + 1;
        const newRating =
          (currentRating * currentTotal + validRating) / newTotal;

        seller.totalRatings = newTotal;
        seller.rating = Math.min(5, Math.max(0, newRating)); // Giới hạn 0-5
        await seller.save();
      }
    }

    res.status(201).json({
      thành_công: true,
      tin_nhan: rootCommentId
        ? "Đã trả lời bình luận"
        : "Bình luận đã được tạo thành công",
      dữ_liệu: await comment.populate("commenterId", "fullName avatar rating"),
    });
  } catch (error) {
    console.error("Lỗi tạo bình luận:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Cập nhật bình luận
// @route   PUT /api/comments/:id
// @access  Riêng tư
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, rating } = req.body;
    const userId = req.user._id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Bình luận không tồn tại",
      });
    }

    // Kiểm tra quyền
    if (comment.commenterId.toString() !== userId.toString()) {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Bạn không có quyền cập nhật bình luận này",
      });
    }

    if (content) comment.content = content;
    if (rating && rating >= 1 && rating <= 5) comment.rating = rating;

    comment.updatedAt = Date.now();
    await comment.save();

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Bình luận đã được cập nhật thành công",
      dữ_liệu: await comment.populate("commenterId", "fullName avatar rating"),
    });
  } catch (error) {
    console.error("Lỗi cập nhật bình luận:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Xóa bình luận
// @route   DELETE /api/comments/:id
// @access  Riêng tư
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Bình luận không tồn tại",
      });
    }

    // Kiểm tra quyền
    if (
      comment.commenterId.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Bạn không có quyền xóa bình luận này",
      });
    }

    await Comment.findByIdAndDelete(id);

    // Giảm số bình luận
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentsCount: -1 },
    });

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Bình luận đã được xóa thành công",
    });
  } catch (error) {
    console.error("Lỗi xóa bình luận:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Thích bình luận
// @route   POST /api/comments/:id/like
// @access  Riêng tư
exports.likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Bình luận không tồn tại",
      });
    }

    // Kiểm tra đã thích chưa
    if (comment.likes.includes(userId)) {
      // Bỏ thích
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Thích
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      thành_công: true,
      tin_nhan: comment.likes.includes(userId)
        ? "Đã thích bình luận"
        : "Đã bỏ thích bình luận",
      dữ_liệu: comment,
    });
  } catch (error) {
    console.error("Lỗi thích bình luận:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Thêm/xóa reaction cho bình luận
// @route   POST /api/comments/:id/react
// @access  Riêng tư
exports.reactToComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reactionType } = req.body;
    const userId = req.user._id;

    // Validate reaction type
    const validReactions = ["like", "love", "haha", "wow", "sad", "angry"];
    if (!validReactions.includes(reactionType)) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Loại cảm xúc không hợp lệ",
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Bình luận không tồn tại",
      });
    }

    // Initialize reactions if not exists
    if (!comment.reactions) {
      comment.reactions = {
        like: [],
        love: [],
        haha: [],
        wow: [],
        sad: [],
        angry: [],
      };
    }

    // Xóa user khỏi tất cả reaction types (chỉ được 1 reaction)
    validReactions.forEach((type) => {
      if (comment.reactions[type]) {
        comment.reactions[type] = comment.reactions[type].filter(
          (id) => id.toString() !== userId.toString()
        );
      }
    });

    // Thêm reaction mới (toggle: nếu đã có thì đã xóa ở trên)
    const hadReaction = comment.reactions[reactionType].some(
      (id) => id.toString() === userId.toString()
    );

    if (!hadReaction) {
      comment.reactions[reactionType].push(userId);
    }

    await comment.save();

    res.status(200).json({
      thành_công: true,
      tin_nhan: hadReaction ? "Đã xóa cảm xúc" : "Đã thêm cảm xúc",
      dữ_liệu: comment,
    });
  } catch (error) {
    console.error("Lỗi react bình luận:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};
