const { createAuditLog } = require("../controllers/auditLogController");

// Middleware để tự động log các request quan trọng
exports.auditMiddleware = (action, description) => {
  return async (req, res, next) => {
    // Lưu original send function
    const originalSend = res.send;

    res.send = function (data) {
      // Chỉ log khi response thành công
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?._id;
        if (userId) {
          createAuditLog({
            userId,
            action,
            description: description || `${action} action`,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers["user-agent"],
            targetId: req.params.id || req.body.postId || req.body.commentId,
            metadata: {
              method: req.method,
              path: req.path,
              body: req.body,
            },
          });
        }
      }

      // Call original send
      originalSend.call(this, data);
    };

    next();
  };
};

// Helper function để log trực tiếp từ controller
exports.logAction = async (req, action, description, targetId, targetType) => {
  const userId = req.user?._id;
  if (!userId) return;

  await createAuditLog({
    userId,
    action,
    description,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.headers["user-agent"],
    targetId,
    targetType,
  });
};
