const User = require("../models/User");
const Warning = require("../models/Warning");

// @desc    Lấy hồ sơ người dùng
// @route   GET /api/users/:id
// @access  Công khai
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -verificationToken");

    if (!user) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Người dùng không tồn tại",
      });
    }

    res.status(200).json({
      thành_công: true,
      dữ_liệu: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Lỗi lấy hồ sơ:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Cập nhật hồ sơ người dùng
// @route   PUT /api/users/:id
// @access  Riêng tư
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, bio, phone, address, avatar, university, major } =
      req.body;

    // Kiểm tra người dùng đang cập nhật là chính mình
    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Bạn không có quyền cập nhật hồ sơ này",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Người dùng không tồn tại",
      });
    }

    // Cập nhật các trường được phép
    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (avatar) user.avatar = avatar;
    if (university) user.university = university;
    if (major) user.major = major;

    user.updatedAt = Date.now();
    await user.save();

    console.log("✅ Profile updated:", user.getPublicProfile());

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Hồ sơ đã được cập nhật thành công",
      dữ_liệu: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Lỗi cập nhật hồ sơ:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Lấy tất cả người dùng (chỉ admin)
// @route   GET /api/users
// @access  Riêng tư/Quản trị
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password -verificationToken")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      thành_công: true,
      dữ_liệu: users.map((u) => u.getPublicProfile()),
      trang_hiện_tại: Number(page),
      tổng_trang: Math.ceil(total / limit),
      tổng_số: total,
    });
  } catch (error) {
    console.error("Lỗi lấy tất cả người dùng:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Khóa/Mở tài khoản người dùng (chỉ admin)
// @route   PUT /api/users/:id/lock
// @access  Riêng tư/Quản trị
exports.lockUnlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, lockReason } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Người dùng không tồn tại",
      });
    }

    user.isActive = isActive;
    if (!isActive) {
      user.lockReason = lockReason || "Bị khóa bởi quản trị viên";
      user.lockedAt = Date.now();
    } else {
      user.lockReason = undefined;
      user.lockedAt = undefined;
    }

    await user.save();

    const hành_động = isActive ? "mở khóa" : "khóa";
    res.status(200).json({
      thành_công: true,
      tin_nhan: `Tài khoản đã được ${hành_động} thành công`,
      người_dùng: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Lỗi khóa/mở tài khoản:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Lấy cảnh báo của người dùng
// @route   GET /api/users/:id/warnings
// @access  Riêng tư
exports.getUserWarnings = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra người dùng chỉ xem cảnh báo của chính mình (trừ admin)
    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Bạn không có quyền xem cảnh báo này",
      });
    }

    const warnings = await Warning.find({ userId: id })
      .populate("adminId", "fullName")
      .populate({
        path: "reportId",
        populate: {
          path: "postId commentId",
          select: "title content",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      thành_công: true,
      dữ_liệu: warnings,
      tổng_số: warnings.length,
    });
  } catch (error) {
    console.error("Lỗi lấy cảnh báo:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Đánh dấu cảnh báo đã đọc
// @route   PUT /api/users/:userId/warnings/:warningId/read
// @access  Riêng tư
exports.markWarningAsRead = async (req, res) => {
  try {
    const { userId, warningId } = req.params;

    // Kiểm tra người dùng chỉ có thể đánh dấu cảnh báo của mình
    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Bạn không có quyền cập nhật cảnh báo này",
      });
    }

    const warning = await Warning.findOneAndUpdate(
      { _id: warningId, userId: userId },
      { isRead: true },
      { new: true }
    );

    if (!warning) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Cảnh báo không tồn tại",
      });
    }

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Đã đánh dấu cảnh báo là đã đọc",
      dữ_liệu: warning,
    });
  } catch (error) {
    console.error("Lỗi đánh dấu cảnh báo:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Xóa người dùng
// @route   DELETE /api/users/:id
// @access  Riêng tư/Quản trị
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Không cho phép xóa tài khoản admin
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Người dùng không tồn tại",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: "Không thể xóa tài khoản admin",
      });
    }

    // Xóa user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Đã xóa tài khoản thành công",
    });
  } catch (error) {
    console.error("Lỗi xóa người dùng:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};
