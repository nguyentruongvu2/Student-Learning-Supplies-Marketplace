import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaShieldAlt,
  FaHandshake,
  FaRocket,
  FaArrowLeft,
} from "react-icons/fa";

const About = () => {
  const navigate = useNavigate();

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
            Về chúng tôi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nền tảng trao đổi và mua bán dụng cụ học tập dành riêng cho sinh
            viên
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FaGraduationCap className="text-4xl text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Sứ mệnh của chúng tôi
            </h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            Chúng tôi xây dựng nền tảng này với mục tiêu tạo ra một môi trường
            an toàn, tiện lợi để sinh viên có thể trao đổi, mua bán các dụng cụ
            học tập với giá cả hợp lý. Chúng tôi hiểu rằng chi phí học tập là
            gánh nặng không nhỏ đối với sinh viên, và việc tái sử dụng các vật
            dụng học tập không chỉ giúp tiết kiệm chi phí mà còn bảo vệ môi
            trường.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaShieldAlt className="text-3xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              An toàn & Tin cậy
            </h3>
            <p className="text-gray-700">
              Hệ thống xác thực người dùng và đánh giá uy tín giúp giao dịch
              diễn ra an toàn, minh bạch.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaHandshake className="text-3xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Cộng đồng sinh viên
            </h3>
            <p className="text-gray-700">
              Kết nối sinh viên với sinh viên, tạo ra một cộng đồng trao đổi,
              chia sẻ kinh nghiệm học tập.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaRocket className="text-3xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Dễ dàng & Nhanh chóng
            </h3>
            <p className="text-gray-700">
              Giao diện thân thiện, dễ sử dụng, giúp bạn đăng bài và tìm kiếm
              sản phẩm chỉ trong vài phút.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-white mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            Thành tựu của chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">10K+</p>
              <p className="text-lg opacity-90">Người dùng hoạt động</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">50K+</p>
              <p className="text-lg opacity-90">Bài đăng</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">100K+</p>
              <p className="text-lg opacity-90">Giao dịch thành công</p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Tầm nhìn tương lai
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Chúng tôi hướng tới việc trở thành nền tảng trao đổi học tập hàng
            đầu cho sinh viên tại Việt Nam. Không chỉ dừng lại ở việc mua bán
            dụng cụ học tập, chúng tôi muốn xây dựng một cộng đồng sinh viên
            năng động, nơi mọi người có thể:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Chia sẻ kiến thức và kinh nghiệm học tập</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Tìm kiếm tài liệu học tập chất lượng với giá hợp lý</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Kết nối và hỗ trợ lẫn nhau trong quá trình học tập</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Góp phần xây dựng môi trường học tập bền vững</span>
            </li>
          </ul>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-4">
            Có câu hỏi hoặc góp ý? Chúng tôi luôn sẵn sàng lắng nghe!
          </p>
          <a
            href="/contact"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Liên hệ với chúng tôi
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
