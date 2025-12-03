import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔄 Đang submit reset password...");
    console.log("🎫 Token:", token);
    console.log("🔐 Password length:", formData.password.length);

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      console.log(
        "📤 Gửi request tới:",
        `${API_URL}/auth/reset-password/${token}`
      );
      const response = await axios.post(
        `${API_URL}/auth/reset-password/${token}`,
        {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      );

      console.log("✅ Response:", response.data);
      if (response.data.thành_công) {
        toast.success("Đặt lại mật khẩu thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Lỗi:", error);
      console.error("📊 Status:", error.response?.status);
      console.error("📋 Data:", error.response?.data);
      console.error("💥 Message:", error.message);
      toast.error(
        error.response?.data?.tin_nhan || "Không thể đặt lại mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🔑 Đặt lại mật khẩu
          </h1>
          <p className="text-gray-600">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
            </div>

            {/* Password strength indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">
                  Độ mạnh mật khẩu:
                </div>
                <div className="flex gap-2">
                  <div
                    className={`h-2 flex-1 rounded ${
                      formData.password.length >= 6
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-2 flex-1 rounded ${
                      formData.password.length >= 8
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-2 flex-1 rounded ${
                      formData.password.length >= 10 &&
                      /[A-Z]/.test(formData.password) &&
                      /[0-9]/.test(formData.password)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {formData.password.length < 6
                    ? "Yếu - Cần ít nhất 6 ký tự"
                    : formData.password.length < 8
                    ? "Trung bình"
                    : "Mạnh"}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-800">
            <strong>🔒 Bảo mật:</strong> Mật khẩu của bạn sẽ được mã hóa an
            toàn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
