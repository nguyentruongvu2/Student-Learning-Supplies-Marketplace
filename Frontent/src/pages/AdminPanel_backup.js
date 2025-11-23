import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { postAPI, reportAPI, userAPI } from "../services/apiService";

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingPosts: 0,
    totalReports: 0,
    lockedUsers: 0,
  });
  const [pendingPosts, setPendingPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch pending posts
      const postsRes = await postAPI.getPendingPosts(1, 50);
      if (postsRes.thành_công) {
        setPendingPosts(postsRes.dữ_liệu);
        setStats((prev) => ({
          ...prev,
          pendingPosts: postsRes.tổng_số || 0,
        }));
      }

      // Fetch reports
      const reportsRes = await reportAPI.getReports("cho_xu_ly", 1, 50);
      if (reportsRes.thành_công) {
        setReports(reportsRes.dữ_liệu);
        setStats((prev) => ({
          ...prev,
          totalReports: reportsRes.tổng_số || 0,
        }));
      }

      // Fetch all users for stats
      const usersRes = await userAPI.getAllUsers(1, 1);
      if (usersRes.thành_công) {
        setStats((prev) => ({
          ...prev,
          totalUsers: usersRes.tổng_số || 0,
        }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.tin_nhan || "Lỗi khi tải dữ liệu quản trị"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      const response = await postAPI.approvePost(postId);
      if (response.thành_công) {
        toast.success(response.tin_nhan || "Duyệt bài đăng thành công");
        setPendingPosts(pendingPosts.filter((p) => p._id !== postId));
      } else {
        toast.error(response.tin_nhan || "Không thể duyệt bài đăng");
      }
    } catch (error) {
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi duyệt bài đăng");
    }
  };

  const handleRejectPost = async (postId) => {
    const reason = window.prompt("Nhập lý do từ chối:");
    if (!reason) return;

    try {
      const response = await postAPI.rejectPost(postId, reason);
      if (response.thành_công) {
        toast.success(response.tin_nhan || "Từ chối bài đăng thành công");
        setPendingPosts(pendingPosts.filter((p) => p._id !== postId));
      } else {
        toast.error(response.tin_nhan || "Không thể từ chối bài đăng");
      }
    } catch (error) {
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi từ chối bài đăng");
    }
  };

  const handleReportAction = async (reportId, action) => {
    try {
      const response = await reportAPI.updateReport(
        reportId,
        "da_xu_ly",
        action
      );
      if (response.thành_công) {
        toast.success(response.tin_nhan || "Xử lý báo cáo thành công");
        setReports(reports.filter((r) => r._id !== reportId));
      } else {
        toast.error(response.tin_nhan || "Không thể xử lý báo cáo");
      }
    } catch (error) {
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi xử lý báo cáo");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải bảng quản trị...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center gap-3">
            🛡️ Bảng quản trị
          </h1>
          <p className="text-gray-600 text-lg mt-2">Quản lý nội dung và người dùng</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Users */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-gray-600 text-sm font-medium mb-2">Tổng người dùng</p>
            <p className="text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>

          {/* Pending Posts */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
            <div className="text-5xl mb-3">⏳</div>
            <p className="text-gray-600 text-sm font-medium mb-2">Bài chờ duyệt</p>
            <p className="text-4xl font-bold text-orange-600">{stats.pendingPosts}</p>
          </div>

          {/* Total Reports */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
            <div className="text-5xl mb-3">⚠️</div>
            <p className="text-gray-600 text-sm font-medium mb-2">Báo cáo chưa xử lý</p>
            <p className="text-4xl font-bold text-red-600">{stats.totalReports}</p>
          </div>

          {/* Locked Users */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
            <div className="text-5xl mb-3">🔒</div>
            <p className="text-gray-600 text-sm font-medium mb-2">Tài khoản khóa</p>
            <p className="text-4xl font-bold text-gray-600">{stats.lockedUsers}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-3 flex-wrap bg-white rounded-2xl shadow-lg p-3 border-2 border-gray-100">
          <button
            onClick={() => setTab("overview")}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              tab === "overview"
                ? "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            📊 Tổng quan
          </button>
          <button
            onClick={() => setTab("posts")}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              tab === "posts"
                ? "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            📝 Bài đăng chờ duyệt
          </button>
          <button
            onClick={() => setTab("reports")}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              tab === "reports"
                ? "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            ⚠️ Báo cáo vi phạm
          </button>
        </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">
              Bài đăng chờ duyệt gần đây
            </h2>
            {pendingPosts.length > 0 ? (
              <div className="space-y-4">
                {pendingPosts.slice(0, 5).map((post) => (
                  <div key={post._id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold">{post.title}</p>
                    <p className="text-sm text-gray-600">
                      Bởi {post.authorId?.fullName || "Ẩn danh"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleApprovePost(post._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleRejectPost(post._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Không có bài đăng chờ duyệt
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Báo cáo vi phạm gần đây</h2>
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.slice(0, 5).map((report) => (
                  <div key={report._id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold">{report.reason}</p>
                    <p className="text-sm text-gray-600">
                      Bởi {report.reporterId?.fullName || "Ẩn danh"}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <button
                        onClick={() =>
                          handleReportAction(report._id, "canh_bao")
                        }
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                      >
                        Cảnh báo
                      </button>
                      <button
                        onClick={() =>
                          handleReportAction(report._id, "tam_khoa")
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Khóa
                      </button>
                      <button
                        onClick={() =>
                          handleReportAction(report._id, "khong_hanh_dong")
                        }
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Bỏ qua
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Không có báo cáo chờ xử lý
              </p>
            )}
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {tab === "posts" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            Tất cả bài đăng chờ duyệt ({pendingPosts.length})
          </h2>
          {pendingPosts.length > 0 ? (
            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <div
                  key={post._id}
                  className="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-400"
                >
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <p className="text-gray-600 mb-2">{post.description}</p>
                  <div className="flex gap-6 text-sm text-gray-600 mb-4">
                    <span>
                      📝 Tác giả: {post.authorId?.fullName || "Ẩn danh"}
                    </span>
                    <span>💰 Giá: {post.price?.toLocaleString("vi-VN")} đ</span>
                    <span>📂 Danh mục: {post.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprovePost(post._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      ✓ Duyệt
                    </button>
                    <button
                      onClick={() => handleRejectPost(post._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      ✕ Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Không có bài đăng chờ duyệt
            </p>
          )}
        </div>
      )}

      {/* Reports Tab */}
      {tab === "reports" && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            ⚠️ Báo cáo vi phạm ({reports.length})
          </h2>
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 hover:border-red-400 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-800 flex-1">{report.reason}</h3>
                    <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                      {report.status || "Chờ xử lý"}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{report.description}</p>
                  <div className="flex gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                    <span>🔍 {report.reporterId?.fullName || "Ẩn danh"}</span>
                    <span>👤 {report.reportedUserId?.fullName || "Ẩn danh"}</span>
                    <span>📅 {new Date(report.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleReportAction(report._id, "canh_bao")}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-bold text-sm hover:bg-yellow-600 transition"
                    >
                      ⚡ Cảnh báo
                    </button>
                    <button
                      onClick={() => handleReportAction(report._id, "tam_khoa")}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition"
                    >
                      🔒 Khóa
                    </button>
                    <button
                      onClick={() => handleReportAction(report._id, "xoa_bai")}
                      className="px-4 py-2 bg-red-800 text-white rounded-lg font-bold text-sm hover:bg-red-900 transition"
                    >
                      🗑️ Xóa bài
                    </button>
                    <button
                      onClick={() =>
                        handleReportAction(report._id, "khong_hanh_dong")
                      }
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg font-bold text-sm hover:bg-gray-600 transition"
                    >
                      ✋ Bỏ qua
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-gray-600 text-lg">Không có báo cáo chưa xử lý</p>
            </div>
          )}
        </div>
      )}

      {/* Posts Tab */}
      {tab === "posts" && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            📝 Bài đăng chờ duyệt ({pendingPosts.length})
          </h2>
          {pendingPosts.length > 0 ? (
            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <div
                  key={post._id}
                  className="p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition"
                >
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{post.description}</p>
                  <div className="flex gap-6 text-sm text-gray-600 mb-4 flex-wrap">
                    <span>✍️ {post.authorId?.fullName || "Ẩn danh"}</span>
                    <span>💰 {post.price?.toLocaleString("vi-VN")} đ</span>
                    <span>📂 {post.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprovePost(post._id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                    >
                      ✅ Duyệt
                    </button>
                    <button
                      onClick={() => handleRejectPost(post._id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                    >
                      ❌ Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-gray-600 text-lg">Không có bài đăng chờ duyệt</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
