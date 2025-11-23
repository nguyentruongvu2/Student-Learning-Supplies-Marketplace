import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../services/apiService";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      setLoading(true);
      const response = await authAPI.verifyEmail(token);
      if (response.thành_công) {
        setVerified(true);
        toast.success(
          response.tin_nhan || "Email đã được xác minh thành công!"
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.tin_nhan || "Xác minh email thất bại");
        toast.error(response.tin_nhan || "Xác minh email thất bại");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.tin_nhan || error.message || "Lỗi xác minh email";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {loading && (
          <div>
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Đang xác minh email...</h1>
            <p className="text-gray-600">Vui lòng chờ một chút</p>
          </div>
        )}

        {!loading && verified && (
          <div>
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Email đã được xác minh!
            </h1>
            <p className="text-gray-600 mb-6">
              Tài khoản của bạn đã sẵn sàng. Bạn sẽ được chuyển hướng đến trang
              đăng nhập...
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
            >
              Đi đến Đăng nhập
            </button>
          </div>
        )}

        {!loading && !verified && error && (
          <div>
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">✕</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Xác minh không thành công
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400"
              >
                Đăng ký lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
