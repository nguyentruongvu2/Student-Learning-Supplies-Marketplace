import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    setStatus("sending");

    // Simulate sending
    setTimeout(() => {
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus("");
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          <FaArrowLeft />
          <span>Quay lại</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Thông tin liên hệ
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <FaEnvelope className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Email
                    </h3>
                    <a
                      href="mailto:nguyentruongvu2023@gmail.com"
                      className="text-blue-600 hover:text-blue-700 hover:underline break-all"
                    >
                      nguyentruongvu2023@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <FaPhone className="text-2xl text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Số điện thoại
                    </h3>
                    <a
                      href="tel:0866461648"
                      className="text-green-600 hover:text-green-700 hover:underline text-lg"
                    >
                      0866461648
                    </a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-4 rounded-full flex-shrink-0">
                    <FaMapMarkerAlt className="text-2xl text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Địa chỉ
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Số 126, đường Nguyễn Thiện Thành,
                      <br />
                      phường Hòa Thuận, tỉnh Vĩnh Long
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Gửi tin nhắn
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập tiêu đề tin nhắn"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {status === "sending" ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Gửi tin nhắn</span>
                    </>
                  )}
                </button>

                {/* Success Message */}
                {status === "success" && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">✓ Gửi thành công!</p>
                    <p className="text-sm">
                      Chúng tôi sẽ phản hồi bạn sớm nhất có thể.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Câu hỏi thường gặp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Làm thế nào để đăng bài?
              </h3>
              <p className="text-gray-600">
                Sau khi đăng nhập, bạn có thể nhấn vào nút "Đăng bài" ở góc trên
                cùng và điền thông tin sản phẩm của mình.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Tôi có thể liên hệ người bán như thế nào?
              </h3>
              <p className="text-gray-600">
                Bạn có thể nhắn tin trực tiếp cho người bán thông qua hệ thống
                chat trên nền tảng.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Giao dịch có an toàn không?
              </h3>
              <p className="text-gray-600">
                Chúng tôi có hệ thống đánh giá và xác thực người dùng để đảm bảo
                an toàn cho mọi giao dịch.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Có mất phí khi sử dụng không?
              </h3>
              <p className="text-gray-600">
                Việc đăng bài và liên hệ người bán hoàn toàn miễn phí cho sinh
                viên.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
