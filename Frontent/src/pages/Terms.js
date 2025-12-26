import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShieldAlt,
} from "react-icons/fa";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          <FaArrowLeft />
          <span>Quay lại</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaShieldAlt className="text-6xl text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Điều khoản sử dụng
          </h1>
          <p className="text-xl text-gray-600">
            Quy định và cam kết khi sử dụng nền tảng
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-2xl text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                1. Chấp nhận điều khoản
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-9">
              Khi truy cập và sử dụng nền tảng "Chợ đồ cũ sinh viên", bạn đồng ý
              tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện được nêu
              trong tài liệu này. Nếu bạn không đồng ý với bất kỳ phần nào của
              các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          {/* Section 2 */}
          <section className="border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-2xl text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                2. Nội dung cấm đăng tải
              </h2>
            </div>
            <div className="ml-9">
              <p className="text-gray-700 leading-relaxed mb-4">
                Người dùng <strong>NGHIÊM CẤM</strong> đăng tải các nội dung
                sau:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-1">✗</span>
                  <span>
                    <strong>Nội dung vi phạm pháp luật:</strong> Hàng cấm, hàng
                    giả, hàng nhái, ma túy, vũ khí, tài liệu vi phạm bản quyền.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-1">✗</span>
                  <span>
                    <strong>Nội dung khiêu dâm, bạo lực:</strong> Hình ảnh,
                    video hoặc văn bản có tính chất khiêu dâm, bạo lực, phản
                    cảm.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-1">✗</span>
                  <span>
                    <strong>Thông tin sai sự thật:</strong> Quảng cáo gian dối,
                    lừa đảo, giả mạo thông tin sản phẩm.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-1">✗</span>
                  <span>
                    <strong>Ngôn từ xúc phạm:</strong> Phát ngôn thù địch, phân
                    biệt đối xử, xúc phạm danh dự người khác.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-1">✗</span>
                  <span>
                    <strong>Spam, lừa đảo:</strong> Đăng bài quá nhiều, lừa đảo
                    giao dịch, chiếm đoạt tài sản.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-2xl text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                3. Cam kết của người dùng
              </h2>
            </div>
            <div className="ml-9">
              <p className="text-gray-700 leading-relaxed mb-4">
                Người dùng cam kết:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span>
                    Cung cấp thông tin chính xác, trung thực về sản phẩm.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span>
                    Đăng tải hình ảnh và mô tả sản phẩm phản ánh đúng thực tế.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span>
                    Giao dịch trung thực, không lừa đảo, không chiếm đoạt tài
                    sản.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span>
                    Tôn trọng quyền riêng tư và thông tin cá nhân của người
                    khác.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span>
                    Tuân thủ pháp luật Việt Nam và các quy định của nền tảng.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="text-2xl text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                4. Trách nhiệm của nền tảng
              </h2>
            </div>
            <div className="ml-9 space-y-3 text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>
                  Cung cấp môi trường giao dịch an toàn, bảo mật thông tin người
                  dùng.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Kiểm duyệt và xóa bỏ các nội dung vi phạm quy định.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>
                  Hỗ trợ giải quyết tranh chấp giữa người mua và người bán.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>
                  Nền tảng không chịu trách nhiệm về chất lượng sản phẩm và giao
                  dịch giữa các bên.
                </span>
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-2xl text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                5. Xử lý vi phạm
              </h2>
            </div>
            <div className="ml-9 space-y-3 text-gray-700">
              <p>Khi phát hiện vi phạm, chúng tôi có quyền:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-1">1.</span>
                  <span>
                    <strong>Cảnh cáo:</strong> Gửi thông báo cảnh cáo qua email
                    hoặc thông báo trên hệ thống.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-1">2.</span>
                  <span>
                    <strong>Xóa bài đăng:</strong> Gỡ bỏ ngay lập tức các bài
                    đăng vi phạm.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-1">3.</span>
                  <span>
                    <strong>Khóa tài khoản tạm thời:</strong> Khóa tài khoản từ
                    7-30 ngày tùy mức độ vi phạm.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-1">4.</span>
                  <span>
                    <strong>Khóa tài khoản vĩnh viễn:</strong> Với các vi phạm
                    nghiêm trọng hoặc tái phạm nhiều lần.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-1">5.</span>
                  <span>
                    <strong>Trình báo cơ quan chức năng:</strong> Đối với các
                    hành vi vi phạm pháp luật.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-2xl text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                6. Quyền riêng tư
              </h2>
            </div>
            <div className="ml-9 text-gray-700 leading-relaxed">
              <p className="mb-3">
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo Chính
                sách bảo mật. Thông tin cá nhân chỉ được sử dụng cho mục đích:
              </p>
              <ul className="space-y-2">
                <li>• Xác thực tài khoản và quản lý người dùng</li>
                <li>• Hỗ trợ giao dịch và giải quyết tranh chấp</li>
                <li>• Cải thiện chất lượng dịch vụ</li>
                <li>• Gửi thông báo quan trọng liên quan đến tài khoản</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="text-2xl text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                7. Thay đổi điều khoản
              </h2>
            </div>
            <div className="ml-9 text-gray-700 leading-relaxed">
              <p>
                Chúng tôi có quyền sửa đổi, bổ sung các điều khoản này bất kỳ
                lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên
                nền tảng. Việc bạn tiếp tục sử dụng dịch vụ sau khi các thay đổi
                có hiệu lực đồng nghĩa với việc bạn chấp nhận các điều khoản
                mới.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-2xl text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">8. Liên hệ</h2>
            </div>
            <div className="ml-9 text-gray-700">
              <p className="mb-4">
                Nếu bạn có bất kỳ câu hỏi nào về Điều khoản sử dụng này, vui
                lòng liên hệ với chúng tôi:
              </p>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <p>
                  <strong>Email:</strong> nguyentruongvu2023@gmail.com
                </p>
                <p>
                  <strong>Số điện thoại:</strong> 0866461648
                </p>
                <p>
                  <strong>Địa chỉ:</strong> Số 126, đường Nguyễn Thiện Thành,
                  phường Hòa Thuận, tỉnh Vĩnh Long
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Notice */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white text-center">
          <p className="text-lg font-semibold mb-2">
            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!
          </p>
          <p className="text-sm opacity-90">
            Hãy cùng nhau xây dựng một cộng đồng sinh viên văn minh, an toàn và
            thân thiện.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
