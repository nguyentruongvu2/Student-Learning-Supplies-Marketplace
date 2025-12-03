const Post = require("../models/Post");
const User = require("../models/User");
const Report = require("../models/Report");
const Comment = require("../models/Comment");

// @desc    Lấy thống kê tổng quan
// @route   GET /api/admin/stats/overview
// @access  Admin
exports.getOverviewStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Thống kê tổng
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "cho_xu_ly" });

    // Thống kê hôm nay
    const todayUsers = await User.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });
    const todayPosts = await Post.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });
    const todayReports = await Report.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    res.status(200).json({
      thành_công: true,
      dữ_liệu: {
        total: {
          users: totalUsers,
          posts: totalPosts,
          reports: totalReports,
          pendingReports,
        },
        today: {
          users: todayUsers,
          posts: todayPosts,
          reports: todayReports,
        },
      },
    });
  } catch (error) {
    console.error("Lỗi lấy thống kê:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ",
    });
  }
};

// @desc    Lấy thống kê theo ngày (7/14/30 ngày gần nhất)
// @route   GET /api/admin/stats/daily?days=7
// @access  Admin
exports.getDailyStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Tạo mảng các ngày
    const dateArray = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dateArray.push(date);
    }

    // Thống kê người dùng đăng ký theo ngày
    const userStats = await Promise.all(
      dateArray.map(async (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = await User.countDocuments({
          createdAt: { $gte: date, $lt: nextDate },
        });

        return {
          date: date.toISOString().split("T")[0],
          count,
        };
      })
    );

    // Thống kê bài đăng theo ngày
    const postStats = await Promise.all(
      dateArray.map(async (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = await Post.countDocuments({
          createdAt: { $gte: date, $lt: nextDate },
        });

        return {
          date: date.toISOString().split("T")[0],
          count,
        };
      })
    );

    // Thống kê báo cáo theo ngày
    const reportStats = await Promise.all(
      dateArray.map(async (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = await Report.countDocuments({
          createdAt: { $gte: date, $lt: nextDate },
        });

        return {
          date: date.toISOString().split("T")[0],
          count,
        };
      })
    );

    // Thống kê bình luận theo ngày
    const commentStats = await Promise.all(
      dateArray.map(async (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = await Comment.countDocuments({
          createdAt: { $gte: date, $lt: nextDate },
        });

        return {
          date: date.toISOString().split("T")[0],
          count,
        };
      })
    );

    res.status(200).json({
      thành_công: true,
      dữ_liệu: {
        users: userStats,
        posts: postStats,
        reports: reportStats,
        comments: commentStats,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy thống kê ngày:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ",
    });
  }
};

// @desc    Lấy thống kê theo tháng (6/12 tháng)
// @route   GET /api/admin/stats/monthly?months=6
// @access  Admin
exports.getMonthlyStats = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const monthArray = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      monthArray.push(date);
    }

    // Thống kê người dùng theo tháng
    const userStats = await Promise.all(
      monthArray.map(async (date) => {
        const nextMonth = new Date(date);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const count = await User.countDocuments({
          createdAt: { $gte: date, $lt: nextMonth },
        });

        return {
          month: `${date.getMonth() + 1}/${date.getFullYear()}`,
          count,
        };
      })
    );

    // Thống kê bài đăng theo tháng
    const postStats = await Promise.all(
      monthArray.map(async (date) => {
        const nextMonth = new Date(date);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const count = await Post.countDocuments({
          createdAt: { $gte: date, $lt: nextMonth },
        });

        return {
          month: `${date.getMonth() + 1}/${date.getFullYear()}`,
          count,
        };
      })
    );

    // Thống kê báo cáo theo tháng
    const reportStats = await Promise.all(
      monthArray.map(async (date) => {
        const nextMonth = new Date(date);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const count = await Report.countDocuments({
          createdAt: { $gte: date, $lt: nextMonth },
        });

        return {
          month: `${date.getMonth() + 1}/${date.getFullYear()}`,
          count,
        };
      })
    );

    res.status(200).json({
      thành_công: true,
      dữ_liệu: {
        users: userStats,
        posts: postStats,
        reports: reportStats,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy thống kê tháng:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ",
    });
  }
};

// @desc    Lấy thống kê phân loại bài đăng
// @route   GET /api/admin/stats/post-categories
// @access  Admin
exports.getPostCategoryStats = async (req, res) => {
  try {
    const categories = await Post.aggregate([
      { $match: { status: "chap_nhan" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      thành_công: true,
      dữ_liệu: categories.map((c) => ({ category: c._id, count: c.count })),
    });
  } catch (error) {
    console.error("Lỗi thống kê danh mục:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ",
    });
  }
};

// @desc    Lấy thống kê loại báo cáo
// @route   GET /api/admin/stats/report-reasons
// @access  Admin
exports.getReportReasonStats = async (req, res) => {
  try {
    const reasons = await Report.aggregate([
      { $group: { _id: "$reason", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      thành_công: true,
      dữ_liệu: reasons.map((r) => ({ reason: r._id, count: r.count })),
    });
  } catch (error) {
    console.error("Lỗi thống kê lý do báo cáo:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ",
    });
  }
};
