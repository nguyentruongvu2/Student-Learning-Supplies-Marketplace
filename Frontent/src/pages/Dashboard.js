import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { postAPI, userAPI } from "../services/apiService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    postsCount: 0,
    totalViews: 0,
    totalComments: 0,
    rating: 0,
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      console.log("Fetching dashboard data for user:", currentUser?._id);

      // Fetch user's posts first
      const postsRes = await postAPI.getUserPosts(1, 10);
      console.log("Posts response:", postsRes);

      if (postsRes.thành_công) {
        const userPosts = postsRes.dữ_liệu;
        setPosts(userPosts);

        // Calculate stats from posts
        const totalViews = userPosts.reduce(
          (sum, post) => sum + (post.viewCount || 0),
          0
        );
        const totalComments = userPosts.reduce(
          (sum, post) => sum + (post.commentCount || 0),
          0
        );

        setStats({
          postsCount: userPosts.length,
          totalViews: totalViews,
          totalComments: totalComments,
          rating: currentUser?.rating || 0,
        });
      } else {
        console.warn("No posts found:", postsRes.tin_nhan);
        setPosts([]);
        setStats({
          postsCount: 0,
          totalViews: 0,
          totalComments: 0,
          rating: currentUser?.rating || 0,
        });
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu bảng điều khiển:", error);
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi tải dữ liệu");
      // Set default stats on error
      setPosts([]);
      setStats({
        postsCount: 0,
        totalViews: 0,
        totalComments: 0,
        rating: currentUser?.rating || 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải bảng điều khiển...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center gap-3">
            📊 Bảng điều khiển
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            👋 Xin chào, {currentUser?.fullName || "Bạn"}! Đây là thống kê hoạt
            động của bạn.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Posts Stat */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">📝</div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">Bài đăng</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              {stats.postsCount}
            </p>
          </div>

          {/* Views Stat */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">👁️</div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">Lượt xem</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
              {stats.totalViews.toLocaleString("vi-VN")}
            </p>
          </div>

          {/* Comments Stat */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">💬</div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">Bình luận</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              {stats.totalComments}
            </p>
          </div>

          {/* Rating Stat */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">⭐</div>
              {stats.rating > 0 && (
                <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                  {stats.rating >= 4.5
                    ? "Xuất sắc"
                    : stats.rating >= 4
                    ? "Tốt"
                    : stats.rating >= 3
                    ? "Khá"
                    : "Cần cải thiện"}
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">Đánh giá</p>
            {stats.rating > 0 ? (
              <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                {stats.rating.toFixed(1)}/5
              </p>
            ) : (
              <p className="text-xl text-gray-400 font-medium">
                Chưa có đánh giá
              </p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Recent Posts */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              📰 Bài đăng gần đây
            </h2>
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {post.description}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ml-4 ${
                          post.status === "chap_nhan"
                            ? "bg-green-100 text-green-800"
                            : post.status === "cho_duyet"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.status === "chap_nhan"
                          ? "✅ Đã duyệt"
                          : post.status === "cho_duyet"
                          ? "⏳ Chờ duyệt"
                          : post.status}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-gray-700 flex-wrap">
                      <span className="flex items-center gap-1">
                        👁️ {post.viewCount || 0} lượt xem
                      </span>
                      <span className="flex items-center gap-1">
                        💬 {post.commentCount || 0} bình luận
                      </span>
                      {post.postType === "ban" && (
                        <span className="flex items-center gap-1 text-green-600">
                          💰 {post.price?.toLocaleString("vi-VN")} đ
                        </span>
                      )}
                      {post.postType === "trao_doi" && (
                        <span className="flex items-center gap-1 text-purple-600">
                          🔄 Trao đổi
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-3">📭</div>
                <p className="text-gray-600 text-lg font-medium">
                  Bạn chưa có bài đăng nào
                </p>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              👤 Thông tin tài khoản
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <p className="text-xs font-bold text-blue-700 mb-1">Tên</p>
                <p className="font-bold text-gray-800 truncate">
                  {currentUser?.fullName || "—"}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border-2 border-green-200">
                <p className="text-xs font-bold text-green-700 mb-1">Email</p>
                <p className="font-bold text-gray-800 truncate text-sm">
                  {currentUser?.email || "—"}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
                <p className="text-xs font-bold text-orange-700 mb-1">
                  Trạng thái
                </p>
                <p
                  className={`font-bold ${
                    currentUser?.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {currentUser?.isActive ? "✅ Hoạt động" : "❌ Bị khóa"}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <p className="text-xs font-bold text-purple-700 mb-1">
                  Vai trò
                </p>
                <p className="font-bold text-gray-800">
                  {currentUser?.role === "sinh_vien"
                    ? "👨‍🎓 Sinh viên"
                    : "👨‍💼 Quản trị viên"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl p-8 border-2 border-blue-400">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            💡 Mẹo để phát triển tài khoản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-400 bg-opacity-30 rounded-lg p-4">
              <p className="font-bold mb-1">📈 Tăng lượt xem</p>
              <p className="text-sm">
                Bài đăng được xem càng nhiều càng tốt để tìm được người phù hợp
              </p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-lg p-4">
              <p className="font-bold mb-1">⭐ Xây dựng uy tín</p>
              <p className="text-sm">
                Đánh giá 5 sao giúp bạn xây dựng uy tín trong cộng đồng
              </p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-lg p-4">
              <p className="font-bold mb-1">💬 Tương tác nhanh</p>
              <p className="text-sm">
                Trả lời bình luận nhanh để tăng tương tác với người dùng khác
              </p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-lg p-4">
              <p className="font-bold mb-1">🎯 Hoàn thiện hồ sơ</p>
              <p className="text-sm">
                Cập nhật hồ sơ với thông tin đầy đủ giúp bạn được tin tưởng hơn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
