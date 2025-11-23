const Report = require("../models/Report");
const Post = require("../models/Post");
const User = require("../models/User");
const Warning = require("../models/Warning");
const { getPaginationParams } = require("../utils/helpers");

// @desc    Lấy tất cả báo cáo (chỉ admin)
// @route   GET /api/reports
// @access  Riêng tư/Quản trị
exports.getReports = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const { skip, lim, pageNum } = getPaginationParams(page, limit);

    let query = {};
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate("reporterId", "fullName email")
      .populate("postId", "title")
      .populate("reportedUserId", "fullName email")
      .skip(skip)
      .limit(lim)
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(query);

    res.status(200).json({
      thành_công: true,
      dữ_liệu: reports,
      trang_hiện_tại: pageNum,
      tổng_trang: Math.ceil(total / lim),
      tổng_số: total,
    });
  } catch (error) {
    console.error("Lỗi lấy báo cáo:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Tạo báo cáo vi phạm
// @route   POST /api/reports
// @access  Riêng tư
exports.createReport = async (req, res) => {
  try {
    const {
      postId,
      commentId,
      reportedUserId,
      reason,
      description,
      reportType,
    } = req.body;
    const reporterId = req.user._id;

    // Log dữ liệu nhận được
    console.log("\n=== NHẬN BÁO CÁO MỚI ===");
    console.log("postId:", postId);
    console.log("commentId:", commentId);
    console.log("reportedUserId:", reportedUserId);
    console.log("reason:", reason);
    console.log("reason type:", typeof reason);
    console.log("reason length:", reason?.length);
    console.log("description:", description);
    console.log("reportType:", reportType);
    console.log("reporterId:", reporterId);
    console.log("====================\n");

    // Xác thực dữ liệu
    if (!reason) {
      console.log("❌ Validation failed: reason is null/undefined");
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Vui lòng chọn lý do báo cáo",
      });
    }

    if (reason.trim() === "") {
      console.log("❌ Validation failed: reason is empty string");
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Lý do báo cáo không được để trống",
      });
    }

    // Kiểm tra phải có ít nhất postId hoặc commentId
    if (!postId && !commentId) {
      console.log("Validation failed: no postId or commentId");
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Vui lòng cung cấp postId hoặc commentId",
      });
    }

    let finalReportedUserId = reportedUserId;

    // Kiểm tra bài đăng nếu có và lấy sellerId nếu không có reportedUserId
    if (postId) {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          thành_công: false,
          tin_nhan: "Bài đăng không tồn tại",
        });
      }

      // Nếu không có reportedUserId, lấy từ post.sellerId
      if (!finalReportedUserId) {
        finalReportedUserId = post.sellerId;
      }
    }

    // Kiểm tra bình luận nếu có và lấy commenterId nếu không có reportedUserId
    if (commentId) {
      const Comment = require("../models/Comment");
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          thành_công: false,
          tin_nhan: "Bình luận không tồn tại",
        });
      }

      // Nếu không có reportedUserId, lấy từ comment.commenterId
      if (!finalReportedUserId) {
        finalReportedUserId = comment.commenterId;
      }
    }

    // Kiểm tra reportedUserId cuối cùng
    if (!finalReportedUserId) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Không thể xác định người bị báo cáo",
      });
    }

    // Kiểm tra người dùng tồn tại
    const reportedUser = await User.findById(finalReportedUserId);
    if (!reportedUser) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Người dùng không tồn tại",
      });
    }

    // Tạo báo cáo
    const report = new Report({
      postId: postId || undefined,
      commentId: commentId || undefined,
      reporterId,
      reportedUserId: finalReportedUserId,
      reason,
      description,
      reportType: reportType || (commentId ? "comment" : "post"),
      status: "cho_xu_ly",
    });

    await report.save();

    console.log("✅ Báo cáo đã được lưu thành công:", report._id);

    res.status(201).json({
      thành_công: true,
      tin_nhan:
        "Báo cáo đã được gửi. Cảm ơn đã giúp chúng tôi duy trì cộng đồng an toàn",
      dữ_liệu: report,
    });
  } catch (error) {
    console.error("Lỗi tạo báo cáo:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Cập nhật trạng thái báo cáo (chỉ admin)
// @route   PUT /api/reports/:id
// @access  Riêng tư/Quản trị
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, action, adminResponse } = req.body;
    const adminId = req.user._id;

    console.log("\n=== XỦ LÝ BÁO CÁO ===");
    console.log("reportId:", id);
    console.log("action:", action);
    console.log("status:", status);
    console.log("adminResponse:", adminResponse);

    const report = await Report.findById(id)
      .populate("reporterId", "fullName email")
      .populate("reportedUserId", "fullName email")
      .populate("postId", "title")
      .populate("commentId");

    if (!report) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Báo cáo không tồn tại",
      });
    }

    // Cập nhật thông tin báo cáo
    report.status = status || "da_xu_ly";
    report.action = action || report.action;
    report.adminId = adminId;
    report.adminResponse = adminResponse || `Hành động: ${action}`;
    report.resolvedAt = Date.now();

    // Xử lý hành động
    if (action === "canh_bao") {
      console.log("⚡ Cảnh báo người dùng:", report.reportedUserId?.fullName);

      // Cập nhật số lần cảnh báo
      const user = await User.findById(report.reportedUserId);
      if (user) {
        user.warningCount = (user.warningCount || 0) + 1;
        await user.save();
        console.log("✅ Đã cảnh báo. Tổng cảnh báo:", user.warningCount);
      }

      // Tạo bản ghi cảnh báo để người dùng xem
      const warning = new Warning({
        userId: report.reportedUserId,
        reportId: report._id,
        adminId: adminId,
        reason: report.reason || "Vi phạm quy định cộng đồng",
        adminResponse:
          adminResponse || `Bạn đã bị cảnh báo do: ${report.reason}`,
      });
      await warning.save();
      console.log("📝 Đã tạo bản ghi cảnh báo:", warning._id);
    } else if (action === "tam_khoa") {
      console.log("🔒 Khóa tài khoản:", report.reportedUserId?.fullName);

      // Khóa tài khoản người dùng
      await User.findByIdAndUpdate(report.reportedUserId, {
        isActive: false,
        lockReason: `Bị khóa do báo cáo: ${report.reason}`,
        lockedAt: Date.now(),
      });
      console.log("✅ Đã khóa tài khoản");
    } else if (action === "xoa_bai") {
      console.log("🗑️ Xóa nội dung...");

      // Xóa bài đăng nếu là báo cáo post
      if (report.postId) {
        await Post.findByIdAndDelete(report.postId);
        console.log("✅ Đã xóa bài đăng:", report.postId);
      }

      // Xóa bình luận nếu là báo cáo comment
      if (report.commentId) {
        const Comment = require("../models/Comment");
        await Comment.findByIdAndDelete(report.commentId);
        console.log("✅ Đã xóa bình luận:", report.commentId);
      }
    } else if (action === "khong_hanh_dong") {
      console.log("✋ Bỏ qua báo cáo");
      report.status = "bi_loai_bo";
    }

    await report.save();

    console.log("✅ Xử lý báo cáo thành công\n");

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Báo cáo đã được xử lý thành công",
      dữ_liệu: report,
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật báo cáo:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Lấy chi tiết báo cáo (chỉ admin)
// @route   GET /api/reports/:id
// @access  Riêng tư/Quản trị
exports.getReportDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id)
      .populate("reporterId", "fullName email avatar")
      .populate("postId")
      .populate("reportedUserId", "fullName email avatar");

    if (!report) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Báo cáo không tồn tại",
      });
    }

    res.status(200).json({
      thành_công: true,
      dữ_liệu: report,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết báo cáo:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};
