import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../services/apiService";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdSchool,
  MdBook,
  MdClose,
  MdPersonAdd,
} from "react-icons/md";

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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center py-4 px-4 z-[200] overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative border border-gray-200 my-4">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-200 z-20"
          title="Đóng"
        >
          <MdClose className="w-6 h-6" />
        </button>

        {/* Logo / Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-3 shadow-lg">
            <MdPersonAdd className="text-4xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Tạo tài khoản mới
          </h1>
          <p className="text-gray-500 text-sm">
            Tham gia cộng đồng Chợ Đồ Cũ Sinh Viên
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm flex items-center gap-1.5">
              <MdPerson className="text-purple-600" />
              Họ tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-gray-800 text-sm"
              placeholder="Nhập họ tên đầy đủ"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm flex items-center gap-1.5">
              <MdEmail className="text-purple-600" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-gray-800 text-sm"
              placeholder="email@example.com"
              required
            />
          </div>

          {/* University & Major - 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            {/* University */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm flex items-center gap-1.5">
                <MdSchool className="text-purple-600" />
                Trường
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-gray-800 text-sm"
                placeholder="Tên trường của bạn"
                required
              />
            </div>

            {/* Major */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm flex items-center gap-1.5">
                <MdBook className="text-purple-600" />
                Ngành
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-gray-800 text-sm"
                placeholder="Ngành học"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm flex items-center gap-1.5">
              <MdLock className="text-purple-600" />
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-gray-800 text-sm"
              placeholder="Tối thiểu 6 ký tự"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm flex items-center gap-1.5">
              <MdLock className="text-purple-600" />
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-gray-800 text-sm"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-4 flex items-center justify-center gap-2"
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
                <MdPersonAdd className="w-5 h-5" />
                Đăng ký ngay
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">hoặc</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors"
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
