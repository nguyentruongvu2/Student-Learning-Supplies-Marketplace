require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const resetPassword = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/nha-cho-sinh-vien"
    );
    console.log("✓ Connected to MongoDB");

    const email = "nguyentruongvu2023@gmail.com";
    const newPassword = "123456";

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      process.exit(1);
    }

    console.log("\n=== BEFORE ===");
    console.log("Email:", user.email);
    console.log("Old hash:", user.password);

    const test1 = await bcrypt.compare("123456", user.password);
    console.log("123456 matches:", test1);

    const test2 = await bcrypt.compare("123456789", user.password);
    console.log("123456789 matches:", test2);

    // Generate new hash
    console.log("\n=== RESETTING ===");
    const newHash = await bcrypt.hash(newPassword, 10);
    console.log("New hash:", newHash);

    // Update user - METHOD 1: Use updateOne to bypass middleware
    await User.updateOne({ email }, { $set: { password: newHash } });

    // Verify
    const updatedUser = await User.findOne({ email });
    console.log("\n=== AFTER ===");
    const verify = await bcrypt.compare(newPassword, updatedUser.password);
    console.log("✅ New password verified:", verify);
    console.log("\n🎉 Password reset complete! Login with: 123456");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

resetPassword();
