import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../services/apiService";

const Login = ({ setIsAuthenticated, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    try {
      setLoading(true);

      // Gọi API đăng nhập thực
      const response = await authAPI.login(formData.email, formData.password);

      if (response.thành_công) {
        // Lưu token và thông tin người dùng
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.người_dùng));

        setIsAuthenticated(true);
        setUser(response.người_dùng);
        toast.success(response.tin_nhan || "Đăng nhập thành công");
        navigate("/");
      } else {
        toast.error(response.tin_nhan || "Lỗi đăng nhập");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.tin_nhan ||
        error.message ||
        "Lỗi đăng nhập, vui lòng thử lại";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/90 to-indigo-900/95 flex items-center justify-center py-12 px-4 z-50 backdrop-blur-md animate-fadeIn">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 z-10 relative transform transition-all duration-300 hover:scale-[1.01] border border-white/20">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:rotate-90 z-20"
        >
          <svg
            className="w-5 h-5"
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
          <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mb-4">
            <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Sinh Viên</h1>
          <p className="text-gray-500 mt-2">Sàn giao dịch cho sinh viên</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">
              📧 Email sinh viên
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              placeholder="your@student.edu.vn"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              🔐 Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition duration-300 transform hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span> Đang xử lý...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t-2 border-gray-200"></div>
          <span className="px-3 text-gray-400 text-sm">hoặc</span>
          <div className="flex-1 border-t-2 border-gray-200"></div>
        </div>

        {/* Register & Forgot Password Links */}
        <div className="text-center space-y-3">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition"
            >
              Đăng ký ngay
            </a>
          </p>
          <p className="text-gray-600">
            <a
              href="/forgot-password"
              className="text-purple-600 font-medium hover:text-purple-700 hover:underline transition"
            >
              🔐 Quên mật khẩu?
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Email test: student1@example.com | Mật khẩu: student123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
