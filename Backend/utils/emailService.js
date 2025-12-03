const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Gửi Email Xác thực
exports.sendVerificationEmail = async (email, verificationLink) => {
  try {
    console.log("📧 Đang gửi email xác thực...");
    console.log("📬 Email nhận:", email);
    console.log("🔗 Verification link:", verificationLink);
    console.log("⚙️ Email config:", {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM,
    });

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Xác thực Email - Nhà cho sinh viên",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Xác thực Email</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Chào mừng bạn đến với Nhà cho sinh viên!</h2>
            <p style="font-size: 16px;">Cảm ơn bạn đã đăng ký tài khoản. Vui lòng click vào nút bên dưới để xác thực email của bạn:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                ✓ Xác thực Email
              </a>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">Hoặc copy và paste link sau vào trình duyệt:</p>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; word-break: break-all; font-size: 14px;">
              <a href="${verificationLink}" style="color: #667eea;">${verificationLink}</a>
            </p>
            <p style="color: #999; font-size: 13px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
              Link này sẽ hết hạn sau 24 giờ.<br>
              Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
            </p>
          </div>
        </body>
        </html>
      `,
    });
    console.log("✅ Email xác thực đã gửi tới:", email);
    console.log("📊 Response:", result);
  } catch (error) {
    console.error("❌ Lỗi gửi email xác thực:", error);
    console.error("📋 Chi tiết lỗi:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });
    throw error;
  }
};

// Gửi Email Đặt lại Mật khẩu
exports.sendPasswordResetEmail = async (email, fullName, resetUrl) => {
  try {
    console.log("📧 Đang gửi email đặt lại mật khẩu...");
    console.log("📬 Email nhận:", email);
    console.log("👤 Tên:", fullName);
    console.log("🔗 Reset URL:", resetUrl);
    console.log("⚙️ Email config:", {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM,
    });

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Đặt lại mật khẩu - Nhà cho sinh viên",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔐 Đặt lại mật khẩu</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Xin chào ${
              fullName || "bạn"
            }!</h2>
            <p style="font-size: 16px;">Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Click vào nút bên dưới để tạo mật khẩu mới:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                🔑 Đặt lại mật khẩu
              </a>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">Hoặc copy và paste link sau vào trình duyệt:</p>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; word-break: break-all; font-size: 14px;">
              <a href="${resetUrl}" style="color: #f5576c;">${resetUrl}</a>
            </p>
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                ⚠️ <strong>Lưu ý:</strong> Link này chỉ có hiệu lực trong <strong>1 giờ</strong>.
              </p>
            </div>
            <p style="color: #999; font-size: 13px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
              Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.
            </p>
          </div>
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Nhà cho sinh viên. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });
    console.log("✅ Email đặt lại mật khẩu đã gửi tới:", email);
    console.log("📊 Response:", result);
  } catch (error) {
    console.error("❌ Lỗi gửi email đặt lại mật khẩu:", error);
    console.error("📋 Chi tiết lỗi:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    throw error;
  }
};

// Gửi Email Thông báo
exports.sendNotificationEmail = async (email, subject, message) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: message,
    });
    console.log("✅ Email thông báo đã gửi tới:", email);
  } catch (error) {
    console.error("❌ Lỗi gửi email thông báo:", error);
    throw error;
  }
};
