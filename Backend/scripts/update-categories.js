/**
 * Script để:
 * 1. Xóa trường color và slug khỏi tất cả Category trong database
 * 2. Cập nhật postCount cho các Category dựa trên số lượng bài đăng thực tế
 */

const mongoose = require("mongoose");
const Category = require("../models/Category");
const Post = require("../models/Post");
require("dotenv").config();

const updateCategories = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Đã kết nối MongoDB");

    // 1. Xóa trường color và slug khỏi tất cả Category
    console.log("\n🔄 Đang xóa trường color và slug...");
    const removeFieldsResult = await Category.updateMany(
      {},
      { $unset: { color: "", slug: "" } }
    );
    console.log(
      `✅ Đã xóa trường color và slug khỏi ${removeFieldsResult.modifiedCount} Category`
    );

    // 2. Cập nhật postCount cho tất cả Category
    console.log("\n🔄 Đang cập nhật postCount...");
    const categories = await Category.find({});

    for (const category of categories) {
      // Đếm số bài đăng đã được duyệt (chap_nhan) theo tên category
      const count = await Post.countDocuments({
        category: category.name,
        status: "chap_nhan",
      });
      category.postCount = count;
      await category.save();
      console.log(`✅ ${category.name}: ${count} bài đăng đã duyệt`);
    }

    console.log("\n✅ Hoàn thành cập nhật Category!");
    console.log("\n📊 Tổng kết:");
    console.log(`- Tổng số danh mục: ${categories.length}`);
    const totalPosts = categories.reduce((sum, cat) => sum + cat.postCount, 0);
    console.log(`- Tổng số bài đăng đã duyệt: ${totalPosts}`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

updateCategories();
