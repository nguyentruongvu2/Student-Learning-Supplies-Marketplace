const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/auth");
const {
  getReports,
  createReport,
  updateReport,
  getReportDetail,
} = require("../controllers/reportController");

// @route   GET /api/reports
// @desc    Lấy tất cả báo cáo (chỉ admin)
// @access  Riêng tư/Quản trị
router.get("/", authenticate, isAdmin, getReports);

// @route   POST /api/reports
// @desc    Tạo báo cáo vi phạm
// @access  Riêng tư
router.post("/", authenticate, createReport);

// @route   PUT /api/reports/:id
// @desc    Cập nhật trạng thái báo cáo (chỉ admin)
// @access  Riêng tư/Quản trị
router.put("/:id", authenticate, isAdmin, updateReport);

// @route   GET /api/reports/:id
// @desc    Lấy chi tiết báo cáo (chỉ admin)
// @access  Riêng tư/Quản trị
router.get("/:id", authenticate, isAdmin, getReportDetail);

module.exports = router;
