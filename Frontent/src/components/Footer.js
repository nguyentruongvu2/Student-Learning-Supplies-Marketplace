import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-20 border-t-4 border-gradient-to-r from-blue-500 to-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Về chúng tôi */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🎓 Về chúng tôi
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nền tảng trao đổi và bán dụng cụ học tập dành cho sinh viên với
              giao dịch an toàn, giá cạnh tranh.
            </p>
          </div>

          {/* Liên kết */}
          <div>
            <h3 className="text-2xl font-bold mb-4">🔗 Liên kết</h3>
            <ul className="text-gray-300 text-sm space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>→</span> Trang chủ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>→</span> Giới thiệu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>→</span> Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="text-2xl font-bold mb-4">❓ Hỗ trợ</h3>
            <ul className="text-gray-300 text-sm space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>→</span> FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>→</span> Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>→</span> Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Theo dõi */}
          <div>
            <h3 className="text-2xl font-bold mb-4">📱 Theo dõi chúng tôi</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 transform"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-lg bg-blue-400 hover:bg-blue-500 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 transform"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 transform"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 transform"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400 mb-1">10K+</p>
              <p className="text-gray-400 text-sm">Người dùng hoạt động</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400 mb-1">50K+</p>
              <p className="text-gray-400 text-sm">Bài đăng</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400 mb-1">100K+</p>
              <p className="text-gray-400 text-sm">Giao dịch</p>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm">
            <p>
              &copy; 2024 🎓 Nhà cho Sinh viên. Nền tảng giao dịch đáng tin cậy
              cho sinh viên.
            </p>
            <p className="mt-2 text-xs">Made with ❤️ for students</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
