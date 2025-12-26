/**
 * Script để:
 * 1. Xóa trường color khỏi tất cả PostType trong database
 * 2. Cập nhật postCount cho các PostType dựa trên số lượng bài đăng thực tế
 */

const mongoose = require("mongoose");
const PostType = require("../models/PostType");
const Post = require("../models/Post");
require("dotenv").config();

const updatePostTypes = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Đã kết nối MongoDB");

    // 1. Xóa trường color khỏi tất cả PostType
    console.log("\n🔄 Đang xóa trường color...");
    const removeColorResult = await PostType.updateMany(
      {},
      { $unset: { color: "" } }
    );
    console.log(
      `✅ Đã xóa trường color khỏi ${removeColorResult.modifiedCount} PostType`
    );

    // 2. Cập nhật postCount cho tất cả PostType
    console.log("\n🔄 Đang cập nhật postCount...");
    const postTypes = await PostType.find({});

    for (const postType of postTypes) {
      const count = await Post.countDocuments({ postType: postType.code });
      postType.postCount = count;
      await postType.save();
      console.log(`✅ ${postType.name} (${postType.code}): ${count} bài đăng`);
    }

    console.log("\n✅ Hoàn thành cập nhật PostType!");
    console.log("\n📊 Tổng kết:");
    console.log(`- Tổng số loại bài đăng: ${postTypes.length}`);
    const totalPosts = postTypes.reduce((sum, pt) => sum + pt.postCount, 0);
    console.log(`- Tổng số bài đăng: ${totalPosts}`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

updatePostTypes();
