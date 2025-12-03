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
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-pink-900/90 to-indigo-900/95 flex items-center justify-center py-12 px-4 z-50 backdrop-blur-md overflow-y-auto">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 z-10 relative transform transition-all duration-300 hover:shadow-purple-500/20 border border-white/20 my-8">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-all duration-200 hover:rotate-90 z-20 group"
          title="Đóng"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-300">
            <span className="text-5xl">✍️</span>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-gray-500 text-sm">Tham gia cộng đồng Chợ Sinh Viên</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              👤 Họ tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 font-medium"
              placeholder="Nhập họ tên đầy đủ"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              📧 Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 font-medium"
              placeholder="email@example.com"
              required
            />
          </div>

          {/* University & Major - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* University */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">
                🏫 Trường
              </label>
              <select
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 font-medium"
              >
                <option value="">Chọn trường</option>
                <option value="Đại học Bách Khoa">Bách Khoa</option>
                <option value="Đại học Kinh tế">Kinh tế</option>
                <option value="Đại học Công nghệ thông tin">CNTT</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Major */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">
                📚 Ngành
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 font-medium"
                placeholder="Ngành học"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              🔐 Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 font-medium"
              placeholder="Tối thiểu 6 ký tự"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              🔒 Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 font-medium"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-base hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Đăng ký ngay"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t-2 border-gray-200"></div>
          <span className="px-4 text-gray-400 text-sm font-medium">hoặc</span>
          <div className="flex-1 border-t-2 border-gray-200"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-purple-600 font-bold hover:text-purple-700 hover:underline transition-colors"
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
