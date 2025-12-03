const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Thông tin cơ bản
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Thông tin sinh viên
    studentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    university: {
      type: String,
      enum: [
        "Đại học Bách Khoa",
        "Đại học Kinh tế",
        "Đại học Công nghệ thông tin",
        "Khác",
      ],
    },
    major: String,

    // Hồ sơ
    avatar: {
      type: String,
      default: null,
    },
    bio: String,
    phone: String,
    address: String,

    // Vai trò
    role: {
      type: String,
      enum: ["sinh_vien", "admin"],
      default: "sinh_vien",
    },

    // Trạng thái tài khoản
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,

    // Reset password
    resetPasswordToken: String,
    resetPasswordExpiry: Date,

    isActive: {
      type: Boolean,
      default: true,
    },
    lockReason: String,
    lockedAt: Date,

    warningCount: {
      type: Number,
      default: 0,
    },

    // Trạng thái online
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },

    // Thống kê
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
    },

    // Bài đăng đã lưu
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "NGUOI_DUNG" }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Phương thức để lấy hồ sơ công khai
userSchema.methods.getPublicProfile = function () {
  const profile = this.toObject();
  delete profile.password;
  delete profile.verificationToken;
  delete profile.verificationTokenExpiry;
  return profile;
};

module.exports = mongoose.model("User", userSchema);
