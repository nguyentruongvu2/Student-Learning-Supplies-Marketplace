require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/nha-cho-sinh-vien"
  )
  .then(async () => {
    const user = await User.findOne({ email: "nguyentruongvu2023@gmail.com" });

    console.log("=== USER STATUS ===");
    console.log("Email:", user.email);
    console.log("isVerified:", user.isVerified);
    console.log("isActive:", user.isActive);
    console.log("Password hash:", user.password);

    console.log("\n=== PASSWORD TEST ===");
    const test1 = await bcrypt.compare("123456", user.password);
    console.log("123456:", test1 ? "✅ MATCH" : "❌ NO MATCH");

    const test2 = await bcrypt.compare("123456789", user.password);
    console.log("123456789:", test2 ? "✅ MATCH" : "❌ NO MATCH");

    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
