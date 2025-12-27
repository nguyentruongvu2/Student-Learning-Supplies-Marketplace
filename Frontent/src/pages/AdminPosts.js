import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { postAPI } from "../services/apiService";
import { Link } from "react-router-dom";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all"); // all, cho_duyet, chap_nhan, tu_choi

  useEffect(() => {
    fetchPosts();
  }, [filterStatus]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let response;

      if (filterStatus === "cho_duyet") {
        response = await postAPI.getPendingPosts(1, 100);
      } else {
        // Lấy tất cả bài đăng
        response = await postAPI.getAllPosts({
          page: 1,
          limit: 100,
          status: filterStatus === "all" ? null : filterStatus,
        });
      }

      if (response.thành_công) {
        setPosts(response.dữ_liệu || response.posts || []);
      }
    } catch (error) {
      toast.error("Lỗi khi tải bài đăng");
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId) => {
    if (!window.confirm("Xác nhận duyệt bài đăng này?")) return;

    try {
      const response = await postAPI.approvePost(postId);
      if (response.thành_công) {
        toast.success("Duyệt bài đăng thành công");
        fetchPosts(); // Reload
      }
    } catch (error) {
      toast.error("Lỗi khi duyệt bài đăng");
    }
  };

  const handleRejectPost = async (postId) => {
    const reason = window.prompt("Nhập lý do từ chối:");
    if (!reason) return;

    try {
      const response = await postAPI.rejectPost(postId, reason);
      if (response.thành_công) {
        toast.success("Từ chối bài đăng thành công");
        fetchPosts(); // Reload
      }
    } catch (error) {
      toast.error("Lỗi khi từ chối bài đăng");
    }
  };

  const handleDeletePost = async (postId) => {
    if (
      !window.confirm(
        "⚠️ XÓA VĨNH VIỄN bài đăng này? Hành động không thể hoàn tác!"
      )
    )
      return;

    try {
      const response = await postAPI.deletePost(postId);
      if (response.thành_công) {
        toast.success("Đã xóa bài đăng");
        fetchPosts(); // Reload
      }
    } catch (error) {
      toast.error("Lỗi khi xóa bài đăng");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "cho_duyet":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold text-sm">
            ⏳ Chờ duyệt
          </span>
        );
      case "chap_nhan":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
            ✅ Đã duyệt
          </span>
        );
      case "tu_choi":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold text-sm">
            ❌ Từ chối
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold text-sm">
            {status}
          </span>
        );
    }
  };

  const filteredPosts = posts;
  const pendingCount = posts.filter((p) => p.status === "cho_duyet").length;
  const approvedCount = posts.filter((p) => p.status === "chap_nhan").length;
  const rejectedCount = posts.filter((p) => p.status === "tu_choi").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          📝 Quản lý bài đăng
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Quản lý tất cả bài đăng trong hệ thống
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            filterStatus === "all"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
          }`}
        >
          📊 Tất cả ({posts.length})
        </button>
        <button
          onClick={() => setFilterStatus("cho_duyet")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            filterStatus === "cho_duyet"
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
          }`}
        >
          ⏳ Chờ duyệt ({pendingCount})
        </button>
        <button
          onClick={() => setFilterStatus("chap_nhan")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            filterStatus === "chap_nhan"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
          }`}
        >
          ✅ Đã duyệt ({approvedCount})
        </button>
        <button
          onClick={() => setFilterStatus("tu_choi")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            filterStatus === "tu_choi"
              ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
          }`}
        >
          ❌ Từ chối ({rejectedCount})
        </button>
      </div>

      {/* Posts List */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      {post.title}
                    </h3>
                    {getStatusBadge(post.status)}
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="flex gap-3 text-sm text-gray-500 flex-wrap">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                      📁 {post.category}
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                      {post.postType === "ban" ? "💰 Bán" : "🔄 Trao đổi"}
                    </span>
                    {post.price && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                        💵 {post.price.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
                      👤{" "}
                      {post.sellerId?.fullName ||
                        post.authorId?.fullName ||
                        "Ẩn danh"}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">
                      📅 {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  {post.rejectionReason && (
                    <div className="mt-3 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                      <p className="text-red-700 text-sm">
                        <strong>Lý do từ chối:</strong> {post.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 min-w-[160px]">
                  <Link
                    to={`/posts/${post._id}`}
                    target="_blank"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-center"
                  >
                    👁️ Xem chi tiết
                  </Link>

                  {post.status === "cho_duyet" && (
                    <>
                      <button
                        onClick={() => handleApprovePost(post._id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                      >
                        ✅ Duyệt
                      </button>
                      <button
                        onClick={() => handleRejectPost(post._id)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                      >
                        ❌ Từ chối
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">
            {filterStatus === "cho_duyet" ? "✅" : "📭"}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {filterStatus === "cho_duyet"
              ? "Không có bài đăng chờ duyệt"
              : "Không có bài đăng"}
          </h3>
          <p className="text-gray-600">
            {filterStatus === "cho_duyet"
              ? "Tất cả bài đăng đã được xử lý"
              : "Chưa có bài đăng nào trong danh mục này"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPosts;
