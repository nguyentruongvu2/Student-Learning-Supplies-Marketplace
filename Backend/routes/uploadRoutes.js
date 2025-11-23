const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  uploadImage,
  uploadImages,
  uploadAvatar,
} = require("../controllers/uploadController");

// POST /api/upload/image
router.post("/image", authenticate, uploadImage);

// POST /api/upload/images
router.post("/images", authenticate, uploadImages);

// POST /api/upload/avatar
router.post("/avatar", authenticate, uploadAvatar);

module.exports = router;
