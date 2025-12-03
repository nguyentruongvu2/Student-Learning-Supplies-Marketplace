import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { reportAPI } from "../services/apiService";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [action, setAction] = useState("");
  const [adminResponse, setAdminResponse] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getReports("cho_xu_ly", 1, 50);
      if (response.thành_công) {
        setReports(response.dữ_liệu);
      }
    } catch (error) {
      toast.error("Lỗi khi tải báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleSubmitAction = async () => {
    if (!action) {
      toast.error("Vui lòng chọn hành động xử lý");
      return;
    }

    try {
      const response = await reportAPI.updateReport(selectedReport._id, {
        status: "da_xu_ly",
        action: action,
        adminResponse: adminResponse || `Đã xử lý: ${action}`,
      });

      if (response.thành_công) {
        toast.success("Đã xử lý báo cáo thành công");
        setReports(reports.filter((r) => r._id !== selectedReport._id));
        setShowModal(false);
        setAction("");
        setAdminResponse("");
        setSelectedReport(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi xử lý báo cáo");
    }
  };

  const handleRejectReport = async (reportId) => {
    try {
      const response = await reportAPI.updateReport(reportId, {
        status: "bi_loai_bo",
        action: "khong_hanh_dong",
        adminResponse: "Báo cáo không hợp lệ hoặc không vi phạm",
      });

      if (response.thành_công) {
        toast.success("Đã từ chối báo cáo");
        setReports(reports.filter((r) => r._id !== reportId));
      }
    } catch (error) {
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi từ chối báo cáo");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          ⚠️ Báo cáo vi phạm
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Có {reports.length} báo cáo đang chờ xử lý
        </p>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {report.reason}
                  </h3>
                  <p className="text-gray-600 mb-3">{report.description}</p>
                  <div className="flex gap-3 text-sm text-gray-500 flex-wrap">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                      👤 Người báo cáo:{" "}
                      {report.reporterId?.fullName || "Ẩn danh"}
                    </span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                      🎯 Đối tượng:{" "}
                      {report.reportedUserId?.fullName || "Ẩn danh"}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">
                      📅{" "}
                      {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleResolveReport(report)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                  >
                    ✅ Đã xử lý
                  </button>
                  <button
                    onClick={() => handleRejectReport(report._id)}
                    className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                  >
                    ❌ Từ chối
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Không có báo cáo chưa xử lý
          </h3>
          <p className="text-gray-600">Tất cả báo cáo đã được xử lý</p>
        </div>
      )}

      {/* Modal chọn hành động */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                🛡️ Xử lý báo cáo vi phạm
              </h2>
              <p className="text-gray-600 mt-2">
                Vui lòng xem xét thông tin và chọn biện pháp xử lý phù hợp
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Thông tin báo cáo */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                <h3 className="font-bold text-lg text-red-800 mb-3 flex items-center gap-2">
                  📋 Thông tin báo cáo
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-gray-700 min-w-[140px]">
                      🚨 Lý do:
                    </span>
                    <span className="text-gray-900 font-bold">
                      {selectedReport.reason}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-gray-700 min-w-[140px]">
                      📝 Mô tả:
                    </span>
                    <span className="text-gray-800">
                      {selectedReport.description || "Không có mô tả"}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-gray-700 min-w-[140px]">
                      👤 Người báo cáo:
                    </span>
                    <span className="text-gray-800">
                      {selectedReport.reporterId?.fullName || "Ẩn danh"} (
                      {selectedReport.reporterId?.email || "N/A"})
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-gray-700 min-w-[140px]">
                      🎯 Người bị báo cáo:
                    </span>
                    <span className="text-red-700 font-bold">
                      {selectedReport.reportedUserId?.fullName || "Ẩn danh"} (
                      {selectedReport.reportedUserId?.email || "N/A"})
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-gray-700 min-w-[140px]">
                      📅 Thời gian:
                    </span>
                    <span className="text-gray-800">
                      {new Date(selectedReport.createdAt).toLocaleString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thông tin nội dung vi phạm */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
                <h3 className="font-bold text-lg text-orange-800 mb-3 flex items-center gap-2">
                  📄 Nội dung bị báo cáo
                </h3>
                {selectedReport.postId && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-gray-700 min-w-[140px]">
                        📰 Loại:
                      </span>
                      <span className="text-orange-700 font-bold">
                        Bài đăng
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-gray-700 min-w-[140px]">
                        📌 Tiêu đề:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {selectedReport.postId?.title || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-gray-700 min-w-[140px]">
                        🆔 ID:
                      </span>
                      <span className="text-gray-600 text-sm font-mono">
                        {selectedReport.postId?._id || selectedReport.postId}
                      </span>
                    </div>
                  </div>
                )}
                {selectedReport.commentId && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-gray-700 min-w-[140px]">
                        💬 Loại:
                      </span>
                      <span className="text-orange-700 font-bold">
                        Bình luận
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-gray-700 min-w-[140px]">
                        🆔 ID:
                      </span>
                      <span className="text-gray-600 text-sm font-mono">
                        {selectedReport.commentId?._id ||
                          selectedReport.commentId}
                      </span>
                    </div>
                  </div>
                )}
                {!selectedReport.postId && !selectedReport.commentId && (
                  <p className="text-gray-500 italic">
                    Không có thông tin nội dung
                  </p>
                )}
              </div>

              {/* Các hành động */}
              <div>
                <label className="block text-base font-bold text-gray-800 mb-4">
                  ⚡ Chọn hành động xử lý *
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <label
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                      action === "canh_bao"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 hover:border-yellow-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="canh_bao"
                      checked={action === "canh_bao"}
                      onChange={(e) => setAction(e.target.value)}
                      className="mr-3 w-5 h-5 text-yellow-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        ⚠️ Cảnh báo người dùng
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Gửi cảnh báo vi phạm, tăng số lần cảnh báo của người
                        dùng
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                      action === "xoa_bai"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="xoa_bai"
                      checked={action === "xoa_bai"}
                      onChange={(e) => setAction(e.target.value)}
                      className="mr-3 w-5 h-5 text-red-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        🗑️ Xóa bài đăng/bình luận
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Xóa nội dung vi phạm khỏi hệ thống
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                      action === "tam_khoa"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="tam_khoa"
                      checked={action === "tam_khoa"}
                      onChange={(e) => setAction(e.target.value)}
                      className="mr-3 w-5 h-5 text-purple-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        🔒 Tạm khóa tài khoản
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Khóa tài khoản người vi phạm, không cho phép đăng nhập
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                      action === "khong_hanh_dong"
                        ? "border-gray-500 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="khong_hanh_dong"
                      checked={action === "khong_hanh_dong"}
                      onChange={(e) => setAction(e.target.value)}
                      className="mr-3 w-5 h-5 text-gray-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        ✋ Không hành động
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Báo cáo không hợp lệ hoặc không vi phạm
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Phản hồi của admin */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phản hồi cho người dùng (tùy chọn)
                </label>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Nhập lý do hoặc ghi chú về quyết định xử lý..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  rows="4"
                />
              </div>
            </div>

            <div className="p-6 border-t-2 border-gray-200 flex gap-4 justify-end bg-gray-50">
              <button
                onClick={() => {
                  setShowModal(false);
                  setAction("");
                  setAdminResponse("");
                  setSelectedReport(null);
                }}
                className="px-8 py-3 bg-gray-500 text-white rounded-xl font-bold hover:bg-gray-600 hover:shadow-lg transition-all"
              >
                ❌ Hủy
              </button>
              <button
                onClick={handleSubmitAction}
                disabled={!action}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${
                  action
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                ✅ Xác nhận xử lý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
