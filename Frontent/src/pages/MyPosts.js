import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postAPI } from "../services/apiService";

const MyPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserPosts();
  }, [page, filterStatus]);

  const fetchUserPosts = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await postAPI.getUserPosts(page, 10, filterStatus);
      if (response.thành_công) {
        setPosts(response.dữ_liệu);
        setTotalPages(response.tổng_trang);
      } else {
        toast.error(response.tin_nhan || "Không thể tải bài đăng");
      }
    } catch (error) {
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi tải bài đăng");
      // Fallback: show empty state
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchUserPosts(true);
    toast.info("🔄 Đang làm mới...");
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này?")) {
      return;
    }

    try {
      const response = await postAPI.deletePost(postId);
      if (response.thành_công) {
        toast.success(response.tin_nhan || "Xóa bài đăng thành công");
        setPage(1);
        fetchUserPosts();
      } else {
        toast.error(response.tin_nhan || "Không thể xóa bài đăng");
      }
    } catch (error) {
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi xóa bài đăng");
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      cho_duyet: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800" },
      chap_nhan: { label: "Đã duyệt", color: "bg-green-100 text-green-800" },
      da_ban: { label: "Đã bán", color: "bg-blue-100 text-blue-800" },
      het_han: { label: "Hết hạn", color: "bg-gray-100 text-gray-800" },
      bi_tu_choi: { label: "Bị từ chối", color: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status] || {
      label: status,
      color: "bg-gray-100",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải bài đăng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 flex items-center gap-3">
              📝 Bài đăng của tôi
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Quản lý tất cả bài đăng của bạn
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transform transition-all duration-300 ${
                refreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Làm mới để xem trạng thái mới nhất"
            >
              {refreshing ? "🔄 Đang tải..." : "🔄 Làm mới"}
            </button>
            <button
              onClick={() => navigate("/create-post")}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              ➕ Tạo bài mới
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8 flex gap-3 flex-wrap bg-white rounded-2xl shadow-lg p-4 border-2 border-gray-100">
          <button
            onClick={() => {
              setFilterStatus(null);
              setPage(1);
            }}
            className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
              filterStatus === null
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => {
              setFilterStatus("cho_duyet");
              setPage(1);
            }}
            className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
              filterStatus === "cho_duyet"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ⏳ Chờ duyệt
          </button>
          <button
            onClick={() => {
              setFilterStatus("chap_nhan");
              setPage(1);
            }}
            className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
              filterStatus === "chap_nhan"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ✅ Đã duyệt
          </button>
        </div>

        {posts.length > 0 ? (
          <>
            <div className="space-y-4 mb-12">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-800 flex-1">
                          {post.title}
                        </h3>
                        {getStatusBadge(post.status)}
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.description}
                      </p>
                      <div className="flex gap-6 text-sm text-gray-600 flex-wrap">
                        {post.postType === "ban" && (
                          <span className="font-bold text-green-600 text-base">
                            💰 {post.price?.toLocaleString("vi-VN")} đ
                          </span>
                        )}
                        {post.postType === "trao_doi" && (
                          <span className="text-purple-600 font-bold text-base">
                            🔄 Trao đổi
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          👁️ {post.viewCount || 0} lượt xem
                        </span>
                        <span className="flex items-center gap-1">
                          💬 {post.commentCount || 0} bình luận
                        </span>
                        <span className="flex items-center gap-1">
                          📅{" "}
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEditPost(post._id)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transform transition-all duration-300 font-bold text-sm"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transform transition-all duration-300 font-bold text-sm"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                ← Trước
              </button>
              <span className="px-4 py-2">
                Trang {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:scale-100 hover:shadow-lg hover:scale-105 transform transition-all duration-300 font-bold"
              >
                Trang sau →
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-16 text-center border-2 border-gray-100">
            <div className="text-7xl mb-4">📭</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              Bạn chưa có bài đăng nào
            </p>
            <p className="text-gray-600 text-lg mb-8">
              Tạo bài đăng đầu tiên của bạn để chia sẻ với cộng đồng sinh viên
            </p>
            <button
              onClick={() => navigate("/create-post")}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              ➕ Tạo bài đăng đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
