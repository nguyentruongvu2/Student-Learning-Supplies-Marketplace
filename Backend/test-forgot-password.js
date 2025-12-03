// Script test forgot password API
const http = require("http");

const testForgotPassword = async () => {
  const email = "nguyentruongvu2023@gmail.com"; // Thay bằng email thật trong DB

  console.log("🧪 Testing Forgot Password API");
  console.log("📬 Email:", email);
  console.log("🔗 API URL: http://localhost:5000/api/auth/forgot-password");
  console.log("\n🔄 Sending request...\n");

  const data = JSON.stringify({ email });

  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/forgot-password",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = http.request(options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("✅ Response received!");
      console.log("📊 Status:", res.statusCode);
      console.log("📋 Data:", responseData);

      try {
        const parsed = JSON.parse(responseData);
        if (parsed.thành_công) {
          console.log("\n✅ Email đã được gửi thành công!");
          console.log("📧 Kiểm tra hộp thư (và spam) của:", email);
        } else {
          console.log("\n❌ Có lỗi:", parsed.tin_nhan);
        }
      } catch (e) {
        console.log("\n⚠️ Response:", responseData);
      }

      process.exit();
    });
  });

  req.on("error", (error) => {
    console.error("❌ Request Failed!");
    console.error("💥 Error:", error.message);
    process.exit(1);
  });

  req.write(data);
  req.end();
};

testForgotPassword();
