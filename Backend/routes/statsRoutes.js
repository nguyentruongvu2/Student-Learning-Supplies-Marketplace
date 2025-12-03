const express = require("express");
const router = express.Router();
const {
  getOverviewStats,
  getDailyStats,
  getMonthlyStats,
  getPostCategoryStats,
  getReportReasonStats,
} = require("../controllers/statsController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Tất cả routes cần admin
router.use(authenticate);
router.use(isAdmin);

// Thống kê tổng quan
router.get("/overview", getOverviewStats);

// Thống kê theo ngày
router.get("/daily", getDailyStats);

// Thống kê theo tháng
router.get("/monthly", getMonthlyStats);

// Thống kê danh mục bài đăng
router.get("/post-categories", getPostCategoryStats);

// Thống kê lý do báo cáo
router.get("/report-reasons", getReportReasonStats);

module.exports = router;
