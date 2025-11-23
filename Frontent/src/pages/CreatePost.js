import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postAPI } from "../services/apiService";
import ImageUpload from "../components/ImageUpload";

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    postType: "ban",
    price: "",
    condition: "",
    location: "",
    images: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Xác thực
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.condition ||
      !formData.location
    ) {
      toast.error("Vui lòng điền tất cả các trường bắt buộc");
      return;
    }

    if (formData.postType === "ban" && !formData.price) {
      toast.error("Vui lòng nhập giá bán");
      return;
    }

    try {
      setLoading(true);
      const response = await postAPI.createPost({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        postType: formData.postType,
        price: formData.postType === "ban" ? parseInt(formData.price) : null,
        condition: formData.condition,
        location: formData.location,
        images: formData.images,
      });

      if (response.thành_công) {
        toast.success(response.tin_nhan || "Bài đăng đã được tạo thành công!");
        navigate("/my-posts");
      } else {
        toast.error(response.tin_nhan || "Lỗi tạo bài đăng");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.tin_nhan ||
        error.message ||
        "Lỗi tạo bài đăng, vui lòng thử lại";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            ✨ Tạo bài đăng mới
          </h1>
          <p className="text-xl text-gray-600">
            Chia sẻ dụng cụ của bạn với cộng đồng sinh viên
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100"
        >
          {/* Tiêu đề */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
              📝 Tiêu đề <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition text-lg"
              placeholder="vd: Sách Toán Rời Rạc - Như mới"
              required
            />
          </div>

          {/* Category & Post Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                📂 Danh mục <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition text-lg"
                required
              >
                <option value="">Chọn danh mục</option>
                <option value="Sách">📖 Sách</option>
                <option value="Bút & Giấy">✏️ Bút & Giấy</option>
                <option value="Máy tính & Điện tử">
                  💻 Máy tính & Điện tử
                </option>
                <option value="Quần áo">👕 Quần áo</option>
                <option value="Khác">📦 Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                🏷️ Loại bài <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="postType"
                value={formData.postType}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition text-lg"
              >
                <option value="ban">💰 Bán</option>
                <option value="trao_doi">🔄 Trao đổi</option>
              </select>
            </div>
          </div>

          {/* Condition & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                ✨ Tình trạng <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition text-lg"
                required
              >
                <option value="">Chọn tình trạng</option>
                <option value="Mới">🆕 Mới</option>
                <option value="Như mới">✨ Như mới</option>
                <option value="Tốt">👍 Tốt</option>
                <option value="Bình thường">👌 Bình thường</option>
              </select>
            </div>

            {formData.postType === "ban" && (
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                  💵 Giá (VNĐ) <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-2xl text-green-600">
                    ₫
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition text-lg"
                    placeholder="50000"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mô tả */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
              📖 Mô tả <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition text-lg resize-none"
              placeholder="Mô tả chi tiết: tình trạng sản phẩm, lý do bán, tìm kiếm gì để trao đổi, v.v..."
              rows="5"
              required
            />
          </div>

          {/* Địa điểm */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
              📍 Địa điểm <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition text-lg"
              placeholder="vd: Ký túc xá B3, Bách Khoa"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-10 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-green-300">
            <ImageUpload
              onImagesChange={(images) => setFormData({ ...formData, images })}
              maxImages={5}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang đăng bài...
              </span>
            ) : (
              "🚀 Đăng bài ngay"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
