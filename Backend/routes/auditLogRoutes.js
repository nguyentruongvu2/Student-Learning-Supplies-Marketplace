const express = require("express");
const router = express.Router();
const {
  getAuditLogs,
  getUserAuditLogs,
  cleanupOldLogs,
} = require("../controllers/auditLogController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Tất cả routes cần admin
router.use(authenticate);
router.use(isAdmin);

// Lấy tất cả audit logs
router.get("/", getAuditLogs);

// Lấy audit logs của 1 user
router.get("/user/:userId", getUserAuditLogs);

// Cleanup old logs
router.delete("/cleanup", cleanupOldLogs);

module.exports = router;
