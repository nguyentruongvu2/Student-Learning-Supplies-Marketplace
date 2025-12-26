import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

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
                <Link
                  to="/"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>→</span> Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>→</span> Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>→</span> Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>→</span> Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-2xl font-bold mb-4">📞 Liên hệ</h3>
            <ul className="text-gray-300 text-sm space-y-3">
              <li>
                <a
                  href="mailto:nguyentruongvu2023@gmail.com"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <FaEnvelope className="text-blue-400" />
                  <span className="break-all">
                    {" "}
                    Email:nguyentruongvu2023@gmail.com
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:0866461648"
                  className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <FaPhone className="text-green-400" />
                  0866461648
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-red-400 mt-1 flex-shrink-0" />
                <span className="leading-relaxed">
                  Địa chỉ: Số 126, đường Nguyễn Thiện Thành, phường Hòa Thuận,
                  tỉnh Vĩnh Long
                </span>
              </li>
            </ul>
          </div>

          {/* Theo dõi */}
          <div>
            <h3 className="text-2xl font-bold mb-4">📱 Theo dõi chúng tôi</h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/TraVinhUniversity.TVU/?locale=vi_VN"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 transform"
                title="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://github.com/nguyentruongvu2/CN-DA22TTA-NGUYENTRUONGVU-StudentMarketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 transform"
                title="GitHub"
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
              &copy; {new Date().getFullYear()} 🎓 Chợ đồ cũ sinh viên. Nền tảng
              giao dịch đáng tin cậy dành cho sinh viên.
            </p>
            <p className="mt-2 text-xs">Made with ❤️ for students</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
