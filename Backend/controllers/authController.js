const User = require("../models/User");
const {
  generateToken,
  generateVerificationToken,
  isValidEmail,
} = require("../utils/helpers");
const { sendVerificationEmail } = require("../utils/emailService");
const bcrypt = require("bcryptjs");

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Công khai
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, university, major } =
      req.body;

    // Xác thực dữ liệu đầu vào
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Vui lòng cung cấp tất cả các trường bắt buộc",
      });
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Mật khẩu không khớp",
      });
    }

    // Kiểm tra định dạng email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Email không hợp lệ",
      });
    }

    // Kiểm tra email đã tồn tại
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Email đã được đăng ký",
      });
    }

    // Tạo người dùng mới
    user = new User({
      fullName,
      email,
      password,
      university: university || "Khác",
      major,
    });

    // Lưu người dùng
    await user.save();

    // Tạo token xác thực email
    const verificationToken = generateVerificationToken();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ
    await user.save();

    // Gửi email xác thực (bắt buộc)
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
      console.log(`📧 Đang gửi email xác thực tới: ${email}`);
      console.log(`🔗 Verification URL: ${verificationUrl}`);
      console.log(`🔑 Token: ${verificationToken}`);
      await sendVerificationEmail(email, verificationUrl);
      console.log(`✓ Email xác thực đã gửi thành công tới: ${email}`);
    } catch (emailError) {
      console.error("❌ Lỗi gửi email xác thực:", emailError);
      console.error("❌ Chi tiết lỗi:", emailError.message);
      return res.status(500).json({
        thành_công: false,
        tin_nhan:
          "Không thể gửi email xác thực. Kiểm tra cấu hình SMTP trong .env",
      });
    }

    res.status(201).json({
      thành_công: true,
      tin_nhan:
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản",
      người_dùng: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Công khai
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Xác thực dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Vui lòng cung cấp email và mật khẩu",
      });
    }

    // Tìm người dùng
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        thành_công: false,
        tin_nhan: "Email hoặc mật khẩu không chính xác",
      });
    }

    // Kiểm tra tài khoản bị khóa
    if (!user.isActive) {
      return res.status(403).json({
        thành_công: false,
        tin_nhan: `Tài khoản của bạn đã bị khóa. Lý do: ${
          user.lockReason || "Không xác định"
        }`,
      });
    }

    // Kiểm tra email đã xác thực
    if (!user.isVerified) {
      return res.status(403).json({
        thành_công: false,
        tin_nhan:
          "Email của bạn chưa được xác thực. Vui lòng kiểm tra email để nhấn link xác minh",
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        thành_công: false,
        tin_nhan: "Email hoặc mật khẩu không chính xác",
      });
    }

    // Tạo JWT token
    const token = generateToken(user._id);

    // Cập nhật trạng thái online
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Đăng nhập thành công",
      token,
      người_dùng: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Xác thực email người dùng
// @route   POST /api/auth/verify-email/:token
// @access  Công khai
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log(`🔍 Đang xác minh email với token: ${token}`);

    if (!token) {
      console.log(`❌ Token không hợp lệ hoặc thiếu`);
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Token xác thực không hợp lệ",
      });
    }

    // Tìm người dùng bằng token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });
    console.log(
      `👤 Người dùng tìm thấy:`,
      user ? `${user.email} (ID: ${user._id})` : "Không tìm thấy"
    );

    if (!user) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Token xác thực hết hạn hoặc không hợp lệ",
      });
    }

    // Đánh dấu email đã xác thực
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();
    console.log(`✅ Email xác minh thành công cho: ${user.email}`);

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Email đã được xác thực thành công",
      người_dùng: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Lỗi xác thực email:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

// @desc    Đăng xuất người dùng
// @route   POST /api/auth/logout
// @access  Riêng tư
exports.logout = async (req, res) => {
  try {
    // Trong mô hình JWT, đăng xuất chủ yếu là xóa token từ client
    // Có thể thêm blacklist token nếu cần
    res.status(200).json({
      thành_công: true,
      tin_nhan: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};
