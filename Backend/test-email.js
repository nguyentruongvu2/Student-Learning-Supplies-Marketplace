// Script test gửi email verification
require("dotenv").config();
const { sendVerificationEmail } = require("./utils/emailService");

const testEmail = async () => {
  const testEmailAddress = "test@example.com"; // Thay bằng email thật của bạn
  const testToken = "test-token-123456";
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${testToken}`;

  console.log("📧 Testing email service...");
  console.log("Email Host:", process.env.EMAIL_HOST);
  console.log("Email User:", process.env.EMAIL_USER);
  console.log("Email From:", process.env.EMAIL_FROM);
  console.log("Verification URL:", verificationUrl);
  console.log("\n🔄 Sending test email...\n");

  try {
    await sendVerificationEmail(testEmailAddress, verificationUrl);
    console.log("✅ Email sent successfully!");
    console.log("📬 Check the inbox of:", testEmailAddress);
  } catch (error) {
    console.error("❌ Email failed:");
    console.error(error);

    if (error.code === "EAUTH") {
      console.log("\n💡 Suggestion: Check your EMAIL_PASSWORD in .env file");
      console.log(
        "   Make sure it's a Gmail App Password, not your regular password"
      );
      console.log("   Get one at: https://myaccount.google.com/apppasswords");
    }
  }

  process.exit();
};

testEmail();
