/**
 * Script tạo dữ liệu seed (tài khoản test và bài viết mẫu)
 * Chạy: node scripts/seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");

const seedUsers = [
  {
    fullName: "Admin Người",
    email: "admin@example.com",
    password: "admin123456",
    university: "Đại học Bách Khoa",
    major: "Công nghệ thông tin",
    role: "admin",
    isVerified: true,
    isActive: true,
  },
  {
    fullName: "Sinh Viên 1",
    email: "student1@example.com",
    password: "student123456",
    university: "Đại học Bách Khoa",
    major: "Công nghệ thông tin",
    role: "sinh_vien",
    isVerified: true,
    isActive: true,
  },
  {
    fullName: "Sinh Viên 2",
    email: "student2@example.com",
    password: "student123456",
    university: "Đại học Kinh tế",
    major: "Quản trị kinh doanh",
    role: "sinh_vien",
    isVerified: true,
    isActive: true,
  },
];

const seedPosts = [
  {
    title: "Bán sách giáo khoa kỹ thuật lập trình",
    description: "Sách mới, chưa sử dụng. Giáo trình từ các giáo sư hàng đầu",
    category: "Sách",
    postType: "ban",
    price: 150000,
    condition: "Mới",
    location: "Quận Tây Hồ, Hà Nội",
    status: "chap_nhan",
    images: [],
  },
  {
    title: "Trao đổi bộ viết cao cấp",
    description: "Trao đổi bộ viết Parker lấy bút chì 2B hoặc bút gel",
    category: "Bút & Giấy",
    postType: "trao_doi",
    condition: "Như mới",
    exchangeFor: "Bút chì 2B hoặc bút gel",
    location: "Quận Ba Đình, Hà Nội",
    status: "chap_nhan",
    images: [],
  },
  {
    title: "Máy tính cầm tay Casio FX-580VN X",
    description: "Máy tính khoa học chính hãng, còn bảo hành 6 tháng",
    category: "Máy tính & Điện tử",
    postType: "ban",
    price: 450000,
    condition: "Như mới",
    location: "Quận Đống Đa, Hà Nội",
    status: "cho_duyet",
    images: [],
  },
  {
    title: "Bán giáo trình Giải tích 1 & 2",
    description: "Bộ sách giải tích đầy đủ, có ghi chú và bài tập đầy đủ",
    category: "Sách",
    postType: "ban",
    price: 200000,
    condition: "Tốt",
    location: "Quận Hai Bà Trưng, Hà Nội",
    status: "cho_duyet",
    images: [],
  },
  {
    title: "Trao đổi áo hoodie size M",
    description: "Trao đổi áo hoodie màu xanh navy size M lấy áo size L",
    category: "Quần áo",
    postType: "trao_doi",
    condition: "Như mới",
    exchangeFor: "Áo hoodie size L",
    location: "Quận Cầu Giấy, Hà Nội",
    status: "cho_duyet",
    images: [],
  },
];

async function seed() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/nha-cho-sinh-vien",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✓ Kết nối MongoDB thành công");

    // Xóa dữ liệu cũ (tuỳ chọn)
    const deleteChoice = process.argv[2];
    if (deleteChoice === "--fresh") {
      await User.deleteMany({});
      await Post.deleteMany({});
      console.log("✓ Đã xóa dữ liệu cũ");
    }

    // Tạo người dùng
    const createdUsers = [];
    for (const userData of seedUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`✓ Tạo user: ${user.email} (${user.role})`);
      } else {
        createdUsers.push(existingUser);
        console.log(`⚠ User ${existingUser.email} đã tồn tại`);
      }
    }

    // Tạo bài viết (gán cho user đầu tiên và thứ hai)
    if (createdUsers.length >= 2) {
      for (let i = 0; i < seedPosts.length; i++) {
        const postData = {
          ...seedPosts[i],
          sellerId: createdUsers[i % 2]._id, // Gán cho user 1 hoặc 2
        };
        const post = await Post.create(postData);
        console.log(`✓ Tạo bài viết: ${post.title}`);
      }
    }

    console.log("\n✅ Seed dữ liệu hoàn tất!");
    console.log("\n📝 Tài khoản test:");
    console.log("  Admin:");
    console.log("    Email: admin@example.com");
    console.log("    Password: admin123456");
    console.log("\n  Student 1:");
    console.log("    Email: student1@example.com");
    console.log("    Password: student123456");
    console.log("\n  Student 2:");
    console.log("    Email: student2@example.com");
    console.log("    Password: student123456");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi seed dữ liệu:", error);
    process.exit(1);
  }
}

seed();
