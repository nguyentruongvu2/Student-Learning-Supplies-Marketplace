const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configure Cloudinary if env available
if (
  process.env.CLOUDINARY_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Multer setup for local uploads
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Helper: upload to cloudinary if configured, otherwise return local path
const uploadFile = async (filePath) => {
  if (
    process.env.CLOUDINARY_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    const res = await cloudinary.uploader.upload(filePath, { folder: "posts" });
    return { url: res.secure_url, provider: "cloudinary" };
  }

  // Fallback: return local accessible URL (served via /uploads)
  const fileName = path.basename(filePath);
  return { url: `/uploads/${fileName}`, provider: "local" };
};

// Single image
exports.uploadImage = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ thành_công: false, tin_nhan: "Không có file" });
      const result = await uploadFile(req.file.path);
      return res.json({
        thành_công: true,
        dữ_liệu: { url: result.url, filename: req.file.filename },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ thành_công: false, tin_nhan: "Lỗi khi tải ảnh" });
    }
  },
];

// Multiple images (field name: files)
exports.uploadImages = [
  upload.array("files", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0)
        return res
          .status(400)
          .json({ thành_công: false, tin_nhan: "Không có file" });

      const uploaded = [];
      for (const file of req.files) {
        const r = await uploadFile(file.path);
        uploaded.push({ url: r.url, filename: file.filename });
      }

      return res.json({ thành_công: true, dữ_liệu: uploaded });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ thành_công: false, tin_nhan: "Lỗi khi tải nhiều ảnh" });
    }
  },
];

// Avatar
exports.uploadAvatar = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ thành_công: false, tin_nhan: "Không có file" });
      const result = await uploadFile(req.file.path);
      return res.json({
        thành_công: true,
        dữ_liệu: { url: result.url, filename: req.file.filename },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ thành_công: false, tin_nhan: "Lỗi khi tải avatar" });
    }
  },
];
