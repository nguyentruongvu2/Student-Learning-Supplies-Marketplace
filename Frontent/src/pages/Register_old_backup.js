import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../services/apiService";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    major: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không trùng khớp");
      return;
    }

    try {
      setLoading(true);

      // Gọi API đăng ký thực
      const response = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        university: formData.university || "Khác",
        major: formData.major,
      });

      if (response.thành_công) {
        toast.success(
          response.tin_nhan || "Đăng ký thành công! Vui lòng xác thực email"
        );
        navigate("/login");
      } else {
        toast.error(response.tin_nhan || "Lỗi đăng ký");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.tin_nhan ||
        error.message ||
        "Lỗi đăng ký, vui lòng thử lại";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center py-12 px-4 z-50 backdrop-blur-sm overflow-y-auto">
      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-10 backdrop-blur-lg relative animate-fadeIn my-8">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mb-4">
            <span className="text-3xl">✍️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Đăng ký tài khoản
          </h1>
          <p className="text-gray-500 mt-2">Tham gia cộng đồng sinh viên</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              👤 Họ tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              placeholder="Nhập họ tên"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              📧 Email sinh viên
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              placeholder="your@student.edu.vn"
              required
            />
          </div>

          {/* University */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              🏫 Trường đại học
            </label>
            <select
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
            >
              <option value="">Chọn trường</option>
              <option value="Đại học Bách Khoa">Đại học Bách Khoa</option>
              <option value="Đại học Kinh tế">Đại học Kinh tế</option>
              <option value="Đại học Công nghệ thông tin">Đại học CNTT</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Major */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              📚 Ngành học
            </label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              placeholder="ví dụ: Công nghệ thông tin"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              🔐 Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              placeholder="Tối thiểu 6 ký tự"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              🔒 Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition duration-300 transform hover:scale-105 mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span> Đang xử lý...
              </span>
            ) : (
              "Đăng ký"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t-2 border-gray-200"></div>
          <span className="px-3 text-gray-400 text-sm">hoặc</span>
          <div className="flex-1 border-t-2 border-gray-200"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-purple-600 font-bold hover:text-purple-700 hover:underline transition"
            >
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
