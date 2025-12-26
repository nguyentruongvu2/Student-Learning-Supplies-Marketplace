/**
 * Script tạo dữ liệu seed cho Categories, PostTypes và Filters
 * Chạy: node scripts/seed-categories-types-filters.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");
const PostType = require("../models/PostType");
const Filter = require("../models/Filter");
const User = require("../models/User");

const seedCategories = [
  {
    name: "Sách",
    description: "Sách giáo khoa, sách tham khảo, truyện...",
    icon: "📚",
    order: 1,
    isActive: true,
  },
  {
    name: "Điện tử",
    description: "Laptop, máy tính bảng, điện thoại, phụ kiện...",
    icon: "💻",
    order: 2,
    isActive: true,
  },
  {
    name: "Văn phòng phẩm",
    description: "Bút, vở, giấy, máy tính cầm tay...",
    icon: "✏️",
    order: 3,
    isActive: true,
  },
  {
    name: "Quần áo",
    description: "Áo, quần, giày dép, phụ kiện thời trang...",
    icon: "👕",
    order: 4,
    isActive: true,
  },
  {
    name: "Thể thao",
    description: "Dụng cụ thể thao, đồ tập gym...",
    icon: "⚽",
    order: 5,
    isActive: true,
  },
  {
    name: "Nội thất",
    description: "Bàn ghế, tủ, giường, đồ dùng phòng trọ...",
    icon: "🪑",
    order: 6,
    isActive: true,
  },
  {
    name: "Khác",
    description: "Các mặt hàng khác (dụng cụ leo núi, nhạc cụ, thú cưng...)",
    icon: "📦",
    order: 99,
    isActive: true,
  },
];

const seedPostTypes = [
  {
    name: "Bán",
    code: "ban",
    description: "Đăng bài bán đồ",
    icon: "💰",
    order: 1,
    isActive: true,
    config: {
      requirePrice: true,
      requireExchangeFor: false,
      allowNegotiation: true,
    },
  },
  {
    name: "Trao đổi",
    code: "trao_doi",
    description: "Trao đổi đồ với nhau",
    icon: "🔄",
    order: 2,
    isActive: true,
    config: {
      requirePrice: false,
      requireExchangeFor: true,
      allowNegotiation: true,
    },
  },
  {
    name: "Cho tặng",
    code: "cho_tang",
    description: "Cho tặng miễn phí",
    icon: "🎁",
    order: 3,
    isActive: true,
    config: {
      requirePrice: false,
      requireExchangeFor: false,
      allowNegotiation: false,
    },
  },
  {
    name: "Tìm mua",
    code: "tim_mua",
    description: "Đăng bài tìm mua đồ",
    icon: "🔍",
    order: 4,
    isActive: true,
    config: {
      requirePrice: false,
      requireExchangeFor: false,
      allowNegotiation: true,
    },
  },
];

const seedFilters = [
  // Bộ lọc tình trạng - áp dụng cho tất cả
  {
    name: "Tình trạng",
    type: "condition",
    group: "general",
    inputType: "select",
    values: [
      { label: "Mới", value: "moi", icon: "✨" },
      { label: "Như mới", value: "nhu_moi", icon: "🌟" },
      { label: "Tốt", value: "tot", icon: "👍" },
      { label: "Khá", value: "kha", icon: "👌" },
      { label: "Trung bình", value: "trung_binh", icon: "🆗" },
    ],
    isActive: true,
    order: 1,
    applicableCategories: [],
    applicablePostTypes: [],
  },
  // Bộ lọc giá
  {
    name: "Khoảng giá",
    type: "price_range",
    group: "general",
    inputType: "range",
    values: [],
    priceRange: {
      min: 0,
      max: 10000000,
      step: 100000,
    },
    isActive: true,
    order: 2,
    applicableCategories: [],
    applicablePostTypes: [],
  },
  // Bộ lọc cho Sách
  {
    name: "Loại sách",
    type: "custom",
    group: "books",
    inputType: "checkbox",
    values: [
      { label: "Giáo khoa", value: "giao_khoa", icon: "📕" },
      { label: "Tham khảo", value: "tham_khao", icon: "📘" },
      { label: "Truyện", value: "truyen", icon: "📖" },
      { label: "Từ điển", value: "tu_dien", icon: "📗" },
    ],
    isActive: true,
    order: 10,
    applicableCategories: ["sach"],
    applicablePostTypes: [],
  },
  // Bộ lọc cho Điện tử
  {
    name: "Loại thiết bị",
    type: "custom",
    group: "electronics",
    inputType: "checkbox",
    values: [
      { label: "Laptop", value: "laptop", icon: "💻" },
      { label: "Điện thoại", value: "dien_thoai", icon: "📱" },
      { label: "Máy tính bảng", value: "may_tinh_bang", icon: "📲" },
      { label: "Phụ kiện", value: "phu_kien", icon: "🔌" },
    ],
    isActive: true,
    order: 20,
    applicableCategories: ["dien-tu"],
    applicablePostTypes: [],
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

    // Lấy admin user để gán createdBy
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("⚠ Không tìm thấy admin user, tạo admin mới...");
      adminUser = await User.create({
        fullName: "Admin",
        email: "admin@example.com",
        password: "admin123456",
        university: "System",
        major: "Admin",
        role: "admin",
        isVerified: true,
        isActive: true,
      });
    }

    console.log("\n📂 Đang tạo Categories...");
    // Xóa categories cũ nếu có
    await Category.deleteMany({});
    const categoryMap = {};
    for (const catData of seedCategories) {
      const category = await Category.create({
        ...catData,
        createdBy: adminUser._id,
      });
      categoryMap[catData.slug] = category._id;
      console.log(`  ✓ Tạo category: ${category.name}`);
    }

    console.log("\n📝 Đang tạo Post Types...");
    // Xóa post types cũ nếu có
    await PostType.deleteMany({});
    const postTypeMap = {};
    for (const typeData of seedPostTypes) {
      const postType = await PostType.create({
        ...typeData,
        createdBy: adminUser._id,
      });
      postTypeMap[typeData.code] = postType._id;
      console.log(`  ✓ Tạo post type: ${postType.name}`);
    }

    console.log("\n🔍 Đang tạo Filters...");
    // Xóa filters cũ nếu có
    await Filter.deleteMany({});
    for (const filterData of seedFilters) {
      // Convert category slugs to IDs
      const applicableCategoryIds = filterData.applicableCategories
        .map((slug) => categoryMap[slug])
        .filter(Boolean);

      const filter = await Filter.create({
        ...filterData,
        applicableCategories: applicableCategoryIds,
        createdBy: adminUser._id,
      });
      console.log(`  ✓ Tạo filter: ${filter.name}`);
    }

    console.log("\n✅ Seed dữ liệu hoàn tất!");
    console.log(`\n📊 Thống kê:`);
    console.log(`   - Categories: ${seedCategories.length}`);
    console.log(`   - Post Types: ${seedPostTypes.length}`);
    console.log(`   - Filters: ${seedFilters.length}`);
    console.log(
      `\n💡 Bây giờ bạn có thể truy cập trang admin để quản lý các mục này!`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi seed dữ liệu:", error);
    process.exit(1);
  }
}

seed();
