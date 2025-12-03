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
    console.log("🔐 Login Request:");
    const { email, password } = req.body;
    console.log("📧 Email:", email);
    console.log("🔑 Password length:", password?.length);

    // Xác thực dữ liệu đầu vào
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Vui lòng cung cấp email và mật khẩu",
      });
    }

    // Tìm người dùng
    const user = await User.findOne({ email });
    console.log("👤 User found:", user ? `✓ ${user.email}` : "✗ Not found");

    if (!user) {
      console.log("❌ Email không tồn tại trong DB");
      return res.status(401).json({
        thành_công: false,
        tin_nhan: "Email hoặc mật khẩu không chính xác",
      });
    }

    // Kiểm tra tài khoản bị khóa
    console.log("🔒 isActive:", user.isActive);
    if (!user.isActive) {
      console.log("❌ Account is locked");
      return res.status(403).json({
        thành_công: false,
        tin_nhan: `Tài khoản của bạn đã bị khóa. Lý do: ${
          user.lockReason || "Không xác định"
        }`,
      });
    }

    // Kiểm tra email đã xác thực
    console.log("✉️ isVerified:", user.isVerified);
    if (!user.isVerified) {
      console.log("❌ Email not verified");
      return res.status(403).json({
        thành_công: false,
        tin_nhan:
          "Email của bạn chưa được xác thực. Vui lòng kiểm tra email để nhấn link xác minh",
      });
    }

    // Kiểm tra mật khẩu
    console.log("🔍 Checking password...");
    const isPasswordValid = await user.matchPassword(password);
    console.log("🔐 Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("❌ Wrong password");
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

// @desc    Quên mật khẩu - Gửi email reset
// @route   POST /api/auth/forgot-password
// @access  Công khai
exports.forgotPassword = async (req, res) => {
  try {
    console.log("📧 Forgot Password Request:");
    const { email } = req.body;
    console.log("📬 Email nhận:", email);

    if (!email) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Vui lòng nhập email",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("👤 Tìm user:", user ? "✓ Có" : "✗ Không có");

    if (!user) {
      return res.status(404).json({
        thành_công: false,
        tin_nhan: "Không tìm thấy tài khoản với email này",
      });
    }

    // Tạo reset token
    const resetToken = generateVerificationToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 3600000; // 1 giờ
    await user.save();
    console.log("🔑 Reset token đã tạo:", resetToken);

    // Gửi email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("🔗 Reset URL:", resetUrl);
    console.log("📤 Đang gửi email...");
    const { sendPasswordResetEmail } = require("../utils/emailService");
    await sendPasswordResetEmail(user.email, user.fullName, resetUrl);
    console.log("✅ Email đã gửi thành công!");

    res.status(200).json({
      thành_công: true,
      tin_nhan: "Email đặt lại mật khẩu đã được gửi",
    });
  } catch (error) {
    console.error("❌ Lỗi forgot password:", error);
    console.error("📋 Chi tiết lỗi:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ",
    });
  }
};

// @desc    Đặt lại mật khẩu
// @route   POST /api/auth/reset-password/:token
// @access  Công khai
exports.resetPassword = async (req, res) => {
  try {
    console.log("🔑 Reset Password Request:");
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    console.log("🔗 Token:", token);
    console.log("📝 Password length:", password?.length);

    if (!password || !confirmPassword) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Vui lòng nhập mật khẩu mới",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Mật khẩu không khớp",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Mật khẩu phải có ít nhất 6 ký tự",
      });
    }

    console.log("🔍 Tìm user với token...");
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    console.log("👤 User tìm thấy:", user ? `✓ ${user.email}` : "✗ Không có");

    if (!user) {
      // Kiểm tra xem có user với token này không (bỏ qua expiry)
      const expiredUser = await User.findOne({ resetPasswordToken: token });
      if (expiredUser) {
        console.log("⏰ Token đã hết hạn!");
        console.log("📅 Expiry:", expiredUser.resetPasswordExpiry);
        console.log("📅 Now:", new Date(Date.now()));
      } else {
        console.log("❌ Token không tồn tại trong DB");
      }

      return res.status(400).json({
        thành_công: false,
        tin_nhan: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
      });
    }

    // Hash mật khẩu mới và update trực tiếp (bypass middleware để tránh double hash)
    console.log("🔒 Đang hash password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Dùng updateOne để bypass pre('save') middleware
    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: "", resetPasswordExpiry: "" },
      }
    );
    console.log("✅ Password đã được cập nhật!");

    res.status(200).json({
      thành_công: true,
      tin_nhan:
        "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ!",
    });
  } catch (error) {
    console.error("❌ Lỗi reset password:", error);
    console.error("📋 Chi tiết lỗi:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      thành_công: false,
      tin_nhan: error.message || "Lỗi máy chủ",
    });
  }
};
