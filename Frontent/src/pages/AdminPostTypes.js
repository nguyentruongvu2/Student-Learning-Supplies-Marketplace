import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AdminPostTypes = () => {
  const [postTypes, setPostTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    icon: "",
    order: 0,
    isActive: true,
    config: {
      requirePrice: true,
      requireExchangeFor: false,
      allowNegotiation: true,
    },
  });

  useEffect(() => {
    fetchPostTypes();
  }, []);

  const fetchPostTypes = async () => {
    try {
      const response = await api.get("/post-types");
      setPostTypes(response.data.postTypes || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post types:", error);
      toast.error("Không thể tải danh sách loại bài đăng");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("config.")) {
      const configKey = name.split(".")[1];
      setFormData({
        ...formData,
        config: {
          ...formData.config,
          [configKey]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        await api.put(`/post-types/${editingType._id}`, formData);
        toast.success("Cập nhật loại bài đăng thành công");
      } else {
        await api.post("/post-types", formData);
        toast.success("Tạo loại bài đăng mới thành công");
      }
      fetchPostTypes();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving post type:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      code: type.code,
      description: type.description || "",
      icon: type.icon || "",
      order: type.order,
      isActive: type.isActive,
      config: type.config,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa loại bài đăng này?")) {
      try {
        await api.delete(`/post-types/${id}`);
        toast.success("Xóa loại bài đăng thành công");
        fetchPostTypes();
      } catch (error) {
        console.error("Error deleting post type:", error);
        toast.error("Không thể xóa loại bài đăng");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingType(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      icon: "",
      order: 0,
      isActive: true,
      config: {
        requirePrice: true,
        requireExchangeFor: false,
        allowNegotiation: true,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Đang tải...</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Loại Bài Đăng</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Thêm Loại Bài Đăng
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mã
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Icon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Số bài đăng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {postTypes.map((type) => (
              <tr key={type._id}>
                <td className="px-6 py-4 whitespace-nowrap">{type.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {type.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {type.icon && <span className="text-2xl">{type.icon}</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {type.postCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      type.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {type.isActive ? "Hoạt động" : "Ẩn"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEdit(type)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(type._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingType ? "Sửa Loại Bài Đăng" : "Thêm Loại Bài Đăng Mới"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tên loại
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mã (code)
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="💰"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Thứ tự
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Cấu hình</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="config.requirePrice"
                        checked={formData.config.requirePrice}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm">Yêu cầu giá</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="config.requireExchangeFor"
                        checked={formData.config.requireExchangeFor}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm">Yêu cầu mô tả trao đổi</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="config.allowNegotiation"
                        checked={formData.config.allowNegotiation}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm">Cho phép thương lượng</label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">Hoạt động</label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editingType ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostTypes;
