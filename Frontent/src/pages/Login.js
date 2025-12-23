import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../services/apiService";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdClose,
  MdSchool,
  MdLogin,
} from "react-icons/md";

const Login = ({ setIsAuthenticated, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔐 Login Submit:");
    console.log("📧 Email:", formData.email);
    console.log("🔑 Password length:", formData.password.length);

    try {
      setLoading(true);

      const response = await authAPI.login(formData.email, formData.password);
      console.log("✅ Login response:", response);

      if (response.thành_công) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.người_dùng));

        setIsAuthenticated(true);
        setUser(response.người_dùng);
        toast.success(response.tin_nhan || "Đăng nhập thành công");

        // Check if user is admin and redirect accordingly
        if (response.người_dùng.role === "admin") {
          navigate("/admin/stats");
        } else {
          navigate("/");
        }
      } else {
        console.log("❌ Login failed:", response.tin_nhan);
        toast.error(response.tin_nhan || "Lỗi đăng nhập");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("📊 Status:", error.response?.status);
      console.error("📋 Data:", error.response?.data);
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
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center py-12 px-4 z-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative border border-gray-200">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-200 z-20"
          title="Đóng"
        >
          <MdClose className="w-6 h-6" />
        </button>

        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <MdSchool className="text-5xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Chào mừng trở lại!
          </h1>
          <p className="text-gray-500 text-sm">
            Đăng nhập vào Chợ Đồ Cũ Sinh Viên
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm flex items-center gap-2">
              <MdEmail className="text-blue-600" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800"
              placeholder="email@example.com"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm flex items-center gap-2">
              <MdLock className="text-blue-600" />
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors p-1"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <MdVisibilityOff className="w-5 h-5" />
                ) : (
                  <MdVisibility className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-semibold text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-6 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              <>
                <MdLogin className="w-5 h-5" />
                Đăng nhập
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">hoặc</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Register & Forgot Password Links */}
        <div className="text-center space-y-3">
          <p className="text-gray-600 text-sm">
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
            >
              Đăng ký ngay
            </a>
          </p>
          <p className="text-gray-600 text-sm">
            <a
              href="/forgot-password"
              className="text-gray-600 font-semibold hover:text-blue-600 hover:underline transition-colors inline-flex items-center gap-1"
            >
              <MdLock className="w-4 h-4" />
              Quên mật khẩu?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
