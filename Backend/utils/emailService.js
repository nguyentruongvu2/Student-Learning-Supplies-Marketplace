const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Gửi Email Xác thực
exports.sendVerificationEmail = async (email, verificationLink) => {
  try {
    await transporter.sendMail({
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
  } catch (error) {
    console.error("❌ Lỗi gửi email xác thực:", error);
    throw error;
  }
};

// Gửi Email Đặt lại Mật khẩu
exports.sendPasswordResetEmail = async (email, resetLink) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Đặt lại Mật khẩu - Nhà cho sinh viên",
      html: `
        <h2>Đặt lại Mật khẩu</h2>
        <p>Vui lòng click vào link dưới đây để đặt lại mật khẩu của bạn:</p>
        <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Đặt lại Mật khẩu
        </a>
        <p style="margin-top: 20px; color: #666;">Link sẽ hết hạn sau 30 phút.</p>
      `,
    });
    console.log("Email đặt lại mật khẩu đã gửi tới:", email);
  } catch (error) {
    console.error("Lỗi gửi email đặt lại mật khẩu:", error);
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
  } catch (error) {
    console.error("Lỗi gửi email thông báo:", error);
    throw error;
  }
};
