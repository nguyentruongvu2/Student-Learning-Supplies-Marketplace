const AuditLog = require("../models/AuditLog");

// Hàm helper để tạo audit log
exports.createAuditLog = async ({
  userId,
  action,
  description,
  ipAddress,
  userAgent,
  targetId,
  targetType,
  metadata,
}) => {
  try {
    const log = new AuditLog({
      userId,
      action,
      description,
      ipAddress,
      userAgent,
      targetId,
      targetType,
      metadata,
    });

    await log.save();
    return log;
  } catch (error) {
    console.error("Lỗi tạo audit log:", error);
    // Không throw error để không ảnh hưởng main flow
  }
};

// @desc    Lấy danh sách audit logs
// @route   GET /api/admin/audit-logs
// @access  Admin
exports.getAuditLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      action,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (userId) query.userId = userId;
    if (action) query.action = action;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const logs = await AuditLog.find(query)
      .populate("userId", "fullName email avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      thành_công: true,
      dữ_liệu: logs,
      trang_hiện_tại: parseInt(page),
      tổng_trang: Math.ceil(total / limit),
      tổng_số: total,
    });
  } catch (error) {
    console.error("Lỗi lấy audit logs:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ",
    });
  }
};

// @desc    Lấy audit logs của 1 user
// @route   GET /api/admin/audit-logs/user/:userId
// @access  Admin
exports.getUserAuditLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const logs = await AuditLog.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments({ userId });

    res.status(200).json({
      thành_công: true,
      dữ_liệu: logs,
      trang_hiện_tại: parseInt(page),
      tổng_trang: Math.ceil(total / limit),
      tổng_số: total,
    });
  } catch (error) {
    console.error("Lỗi lấy user audit logs:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ",
    });
  }
};

// @desc    Xóa audit logs cũ (cleanup)
// @route   DELETE /api/admin/audit-logs/cleanup
// @access  Admin
exports.cleanupOldLogs = async (req, res) => {
  try {
    const { days = 90 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await AuditLog.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    res.status(200).json({
      thành_công: true,
      tin_nhan: `Đã xóa ${result.deletedCount} logs cũ hơn ${days} ngày`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Lỗi cleanup logs:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ",
    });
  }
};
