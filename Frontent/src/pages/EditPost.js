import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postAPI } from "../services/apiService";
import ImageUpload from "../components/ImageUpload";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Sách",
    postType: "ban",
    price: "",
    condition: "Như mới",
    location: "",
    images: [],
  });

  const categories = [
    "Sách",
    "Đồ dùng học tập",
    "Điện tử",
    "Quần áo",
    "Ký túc xá",
    "Khác",
  ];
  const conditions = ["Như mới", "Tốt", "Bình thường", "Cần sửa chữa"];

  useEffect(() => {
    fetchPostDetail();
  }, [id]);

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getPostDetail(id);
      if (response.thành_công) {
        const post = response.dữ_liệu;
        setFormData({
          title: post.title,
          description: post.description,
          category: post.category,
          postType: post.postType,
          price: post.price || "",
          condition: post.condition,
          location: post.location,
          images: post.images || [],
        });
      } else {
        toast.error(response.tin_nhan || "Không thể tải bài đăng");
        navigate("/my-posts");
      }
    } catch (error) {
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi tải bài đăng");
      navigate("/my-posts");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (images) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.warn("Vui lòng nhập tiêu đề");
      return;
    }
    if (!formData.description.trim()) {
      toast.warn("Vui lòng nhập mô tả");
      return;
    }
    if (formData.postType === "ban" && !formData.price) {
      toast.warn("Vui lòng nhập giá cho bài đăng bán");
      return;
    }

    try {
      setSubmitting(true);
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.postType === "ban" ? parseInt(formData.price) : null,
        condition: formData.condition,
        location: formData.location,
        postType: formData.postType,
        images: formData.images,
      };

      const response = await postAPI.updatePost(id, updateData);
      if (response.thành_công) {
        toast.success(response.tin_nhan || "Cập nhật bài đăng thành công");
        navigate("/my-posts");
      } else {
        toast.error(response.tin_nhan || "Không thể cập nhật bài đăng");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.tin_nhan || "Lỗi khi cập nhật bài đăng"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa bài đăng</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 space-y-5"
      >
        {/* Tiêu đề */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Tiêu đề *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Nhập tiêu đề bài đăng"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Mô tả chi tiết *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            rows="6"
            placeholder="Mô tả chi tiết về bài đăng của bạn"
          />
        </div>

        {/* Loại bài đăng */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Loại bài đăng
            </label>
            <select
              name="postType"
              value={formData.postType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ban">Bán</option>
              <option value="trao_doi">Trao đổi</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Danh mục
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Giá (chỉ hiện khi loại là "bán") */}
        {formData.postType === "ban" && (
          <div>
            <label className="block text-gray-700 font-bold mb-2">Giá *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nhập giá (VNĐ)"
            />
          </div>
        )}

        {/* Tình trạng và Địa điểm */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Tình trạng
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {conditions.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Địa điểm
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ký túc xá, địa điểm..."
            />
          </div>
        </div>

        {/* Hình ảnh hiện tại */}
        {formData.images.length > 0 && (
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Hình ảnh hiện tại
            </label>
            <div className="grid grid-cols-4 gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt={`Ảnh ${idx + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload / update images */}
        <div>
          <ImageUpload onImagesChange={handleImagesChange} maxImages={6} />
        </div>

        {/* Nút hành động */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Đang cập nhật..." : "Cập nhật bài đăng"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/my-posts")}
            className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
