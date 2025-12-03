import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { postAPI, reportAPI, userAPI } from "../services/apiService";
import DashboardStats from "../components/DashboardStats";

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingPosts: 0,
    totalReports: 0,
    lockedUsers: 0,
  });
  const [pendingPosts, setPendingPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("stats");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      console.log("Fetching admin data...");

      const postsRes = await postAPI.getPendingPosts(1, 50);
      console.log("Posts response:", postsRes);

      if (postsRes.thành_công) {
        setPendingPosts(postsRes.dữ_liệu);
        setStats((prev) => ({
          ...prev,
          pendingPosts: postsRes.tổng_số || 0,
        }));
      } else {
        console.warn("No pending posts:", postsRes.tin_nhan);
      }

      const reportsRes = await reportAPI.getReports("cho_xu_ly", 1, 50);
      console.log("Reports response:", reportsRes);

      if (reportsRes.thành_công) {
        setReports(reportsRes.dữ_liệu);
        setStats((prev) => ({
          ...prev,
          totalReports: reportsRes.tổng_số || 0,
        }));
      }

      const usersRes = await userAPI.getAllUsers(1, 100);
      console.log("Users response:", usersRes);

      if (usersRes.thành_công) {
        setUsers(usersRes.dữ_liệu || []);
        const lockedCount = (usersRes.dữ_liệu || []).filter(
          (u) => !u.isActive
        ).length;
        setStats((prev) => ({
          ...prev,
          totalUsers: usersRes.tổng_số || 0,
          lockedUsers: lockedCount,
        }));
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
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
    // Xác nhận trước khi thực hiện hành động
    const confirmMessages = {
      canh_bao: "Bạn có chắc muốn cảnh báo người dùng này?",
      tam_khoa:
        "Bạn có chắc muốn KHÓA tài khoản này? Hành động này rất nghiêm trọng!",
      xoa_bai: "Bạn có chắc muốn XÓA nội dung này? Không thể hoàn tác!",
      khong_hanh_dong: "Bạn có chắc muốn bỏ qua báo cáo này?",
    };

    if (!window.confirm(confirmMessages[action] || "Bạn có chắc chắn?")) {
      return;
    }

    // Yêu cầu nhập lý do cho một số hành động
    let adminResponse = null;
    if (action === "tam_khoa" || action === "xoa_bai") {
      adminResponse = window.prompt(
        `Nhập lý do ${
          action === "tam_khoa" ? "khóa tài khoản" : "xóa nội dung"
        }:`
      );
      if (!adminResponse || adminResponse.trim() === "") {
        toast.warning("Vui lòng nhập lý do");
        return;
      }
    }

    try {
      console.log("Xử lý báo cáo:", { reportId, action, adminResponse });

      const response = await reportAPI.handleReport(
        reportId,
        action,
        adminResponse
      );

      console.log("Kết quả:", response);

      if (response.thành_công) {
        const successMessages = {
          canh_bao: "⚡ Đã gửi cảnh báo thành công",
          tam_khoa: "🔒 Đã khóa tài khoản thành công",
          xoa_bai: "🗑️ Đã xóa nội dung thành công",
          khong_hanh_dong: "✋ Đã bỏ qua báo cáo",
        };

        toast.success(
          successMessages[action] || response.tin_nhan || "Xử lý thành công"
        );

        // Xóa báo cáo khỏi danh sách
        setReports(reports.filter((r) => r._id !== reportId));

        // Cập nhật thống kê
        setStats((prev) => ({
          ...prev,
          totalReports: Math.max(0, prev.totalReports - 1),
        }));
      } else {
        toast.error(response.tin_nhan || "Không thể xử lý báo cáo");
      }
    } catch (error) {
      console.error("Lỗi xử lý báo cáo:", error);
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi xử lý báo cáo");
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus ? "khóa" : "mở khóa";
    const lockReason = !currentStatus
      ? null
      : window.prompt(`Nhập lý do ${action} tài khoản:`);

    if (!currentStatus && !lockReason) {
      toast.warning("Vui lòng nhập lý do khóa");
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn ${action} tài khoản này?`)) {
      return;
    }

    try {
      const response = await userAPI.lockUnlockUser(
        userId,
        !currentStatus,
        lockReason
      );
      if (response.thành_công) {
        toast.success(
          `${action === "khóa" ? "🔒" : "🔓"} ${
            action.charAt(0).toUpperCase() + action.slice(1)
          } tài khoản thành công`
        );

        // Cập nhật danh sách users
        setUsers(
          users.map((u) =>
            u._id === userId
              ? { ...u, isActive: !currentStatus, lockReason: lockReason }
              : u
          )
        );

        // Cập nhật selected user nếu đang xem
        if (selectedUser?._id === userId) {
          setSelectedUser({
            ...selectedUser,
            isActive: !currentStatus,
            lockReason: lockReason,
          });
        }

        // Cập nhật stats
        setStats((prev) => ({
          ...prev,
          lockedUsers: !currentStatus
            ? prev.lockedUsers + 1
            : Math.max(0, prev.lockedUsers - 1),
        }));
      } else {
        toast.error(response.tin_nhan || `Không thể ${action} tài khoản`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.tin_nhan || `Lỗi khi ${action} tài khoản`
      );
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
          <p className="text-gray-600 text-lg mt-2">
            Quản lý nội dung và người dùng
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
          <button
            onClick={() => setTab("stats")}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
              tab === "stats"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📊 Thống kê
          </button>
          <button
            onClick={() => setTab("posts")}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
              tab === "posts"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📝 Duyệt bài ({stats.pendingPosts})
          </button>
          <button
            onClick={() => setTab("reports")}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
              tab === "reports"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            🚩 Báo cáo ({stats.totalReports})
          </button>
          <button
            onClick={() => setTab("users")}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
              tab === "users"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            👥 Người dùng ({stats.totalUsers})
          </button>
        </div>

        {/* Tab Content */}
        {tab === "stats" && (
          <div>
            <DashboardStats />
          </div>
        )}

        {tab === "posts" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📝 Bài đăng chờ duyệt
            </h2>
            {pendingPosts.length > 0 ? (
              <div className="space-y-4">
                {pendingPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex gap-2 text-sm text-gray-500">
                          <span>📁 {post.category}</span>
                          <span>•</span>
                          <span>
                            {post.postType === "ban" ? "💰 Bán" : "🔄 Trao đổi"}
                          </span>
                          {post.postType === "ban" && (
                            <>
                              <span>•</span>
                              <span className="font-bold text-green-600">
                                {post.price?.toLocaleString("vi-VN")} đ
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApprovePost(post._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          ✓ Duyệt
                        </button>
                        <button
                          onClick={() => handleRejectPost(post._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          ✕ Từ chối
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Không có bài đăng chờ duyệt
              </div>
            )}
          </div>
        )}

        {tab === "reports" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🚩 Báo cáo chờ xử lý
            </h2>
                        <button
                          onClick={() => handleApprovePost(post._id)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold text-sm hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                        >
                          ✅ Duyệt
                        </button>
                        <button
                          onClick={() => handleRejectPost(post._id)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold text-sm hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                        >
                          ❌ Từ chối
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gray-600">Không có bài đăng chờ duyệt</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                ⚠️ Báo cáo gần đây
              </h2>
              {reports.slice(0, 3).length > 0 ? (
                <div className="space-y-4">
                  {reports.slice(0, 3).map((report) => (
                    <div
                      key={report._id}
                      className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 hover:border-red-400 transition"
                    >
                      <p className="font-bold text-gray-800 mb-1">
                        {report.reason}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        Bởi: {report.reporterId?.fullName || "Ẩn danh"}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            handleReportAction(report._id, "canh_bao")
                          }
                          className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs font-bold hover:bg-yellow-600 transition"
                        >
                          ⚡ Cảnh báo
                        </button>
                        <button
                          onClick={() =>
                            handleReportAction(report._id, "tam_khoa")
                          }
                          className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
                        >
                          🔒 Khóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gray-600">Không có báo cáo</p>
                </div>
              )}
            </div>
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
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{post.description}</p>
                    <div className="flex gap-6 text-sm text-gray-600 mb-4 flex-wrap">
                      <span>✍️ {post.sellerId?.fullName || "Ẩn danh"}</span>
                      <span>
                        💰{" "}
                        {post.price
                          ? `${post.price?.toLocaleString("vi-VN")} đ`
                          : "Trao đổi"}
                      </span>
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
                <p className="text-gray-600 text-lg">
                  Không có bài đăng chờ duyệt
                </p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              👥 Quản lý người dùng ({users.length})
            </h2>
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Tên
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Vai trò
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Cảnh báo
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                              {user.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-800">
                              {user.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role === "admin"
                              ? "👨‍💼 Admin"
                              : "👨‍🎓 Sinh viên"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.isActive ? "✅ Hoạt động" : "🔒 Bị khóa"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              (user.warningCount || 0) === 0
                                ? "bg-gray-100 text-gray-600"
                                : (user.warningCount || 0) < 3
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            ⚠️ {user.warningCount || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition"
                            >
                              👁️ Xem
                            </button>
                            <button
                              onClick={() =>
                                handleToggleUserStatus(user._id, user.isActive)
                              }
                              className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                                user.isActive
                                  ? "bg-red-500 text-white hover:bg-red-600"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                            >
                              {user.isActive ? "🔒 Khóa" : "🔓 Mở"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-5xl mb-3">👥</div>
                <p className="text-gray-600 text-lg">Không có người dùng</p>
              </div>
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
                      <h3 className="font-bold text-gray-800">
                        {report.reason}
                      </h3>
                      <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                        {report.status || "Chờ xử lý"}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{report.description}</p>
                    <div className="flex gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                      <span>🔍 {report.reporterId?.fullName || "Ẩn danh"}</span>
                      <span>
                        👤 {report.reportedUserId?.fullName || "Ẩn danh"}
                      </span>
                      <span>
                        📅{" "}
                        {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() =>
                          handleReportAction(report._id, "canh_bao")
                        }
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-bold text-sm hover:bg-yellow-600 transition"
                      >
                        ⚡ Cảnh báo
                      </button>
                      <button
                        onClick={() =>
                          handleReportAction(report._id, "tam_khoa")
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition"
                      >
                        🔒 Khóa
                      </button>
                      <button
                        onClick={() =>
                          handleReportAction(report._id, "xoa_bai")
                        }
                        className="px-4 py-2 bg-red-800 text-white rounded-lg font-bold text-sm hover:bg-red-900 transition"
                      >
                        🗑️ Xóa
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
                <p className="text-gray-600 text-lg">
                  Không có báo cáo chưa xử lý
                </p>
              </div>
            )}
          </div>
        )}

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-2xl font-bold">
                      {selectedUser.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedUser.fullName}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Status */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      📊 Trạng thái tài khoản
                    </h3>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        selectedUser.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedUser.isActive ? "✅ Hoạt động" : "🔒 Bị khóa"}
                    </span>
                  </div>
                  {!selectedUser.isActive && selectedUser.lockReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-bold text-red-700 mb-1">
                        Lý do khóa:
                      </p>
                      <p className="text-sm text-red-600">
                        {selectedUser.lockReason}
                      </p>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 mb-1">
                      Vai trò
                    </p>
                    <p className="font-bold text-gray-800">
                      {selectedUser.role === "admin"
                        ? "👨‍💼 Quản trị viên"
                        : "👨‍🎓 Sinh viên"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 mb-1">
                      Cảnh báo
                    </p>
                    <p className="font-bold text-orange-600">
                      ⚠️ {selectedUser.warningCount || 0} lần
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 mb-1">
                      Đánh giá
                    </p>
                    <p className="font-bold text-yellow-600">
                      ⭐ {selectedUser.rating?.toFixed(1) || "0.0"}/5
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 mb-1">
                      Email xác thực
                    </p>
                    <p className="font-bold text-gray-800">
                      {selectedUser.isVerified
                        ? "✅ Đã xác thực"
                        : "❌ Chưa xác thực"}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                {(selectedUser.university ||
                  selectedUser.major ||
                  selectedUser.phone) && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      📚 Thông tin bổ sung
                    </h3>
                    <div className="space-y-2">
                      {selectedUser.university && (
                        <p className="text-sm text-gray-700">
                          <span className="font-bold">Trường:</span>{" "}
                          {selectedUser.university}
                        </p>
                      )}
                      {selectedUser.major && (
                        <p className="text-sm text-gray-700">
                          <span className="font-bold">Chuyên ngành:</span>{" "}
                          {selectedUser.major}
                        </p>
                      )}
                      {selectedUser.phone && (
                        <p className="text-sm text-gray-700">
                          <span className="font-bold">Số điện thoại:</span>{" "}
                          {selectedUser.phone}
                        </p>
                      )}
                      {selectedUser.address && (
                        <p className="text-sm text-gray-700">
                          <span className="font-bold">Địa chỉ:</span>{" "}
                          {selectedUser.address}
                        </p>
                      )}
                      {selectedUser.bio && (
                        <p className="text-sm text-gray-700">
                          <span className="font-bold">Giới thiệu:</span>{" "}
                          {selectedUser.bio}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 mb-1">
                      Ngày tạo
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      📅{" "}
                      {new Date(selectedUser.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 mb-1">
                      Hoạt động gần nhất
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      🕐{" "}
                      {selectedUser.lastSeen
                        ? new Date(selectedUser.lastSeen).toLocaleDateString(
                            "vi-VN"
                          )
                        : "Chưa có"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() =>
                      handleToggleUserStatus(
                        selectedUser._id,
                        selectedUser.isActive
                      )
                    }
                    className={`flex-1 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 ${
                      selectedUser.isActive
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg"
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
                    }`}
                  >
                    {selectedUser.isActive
                      ? "🔒 Khóa tài khoản"
                      : "🔓 Mở khóa tài khoản"}
                  </button>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
