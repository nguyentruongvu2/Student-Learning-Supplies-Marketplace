import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { postAPI } from "../services/apiService";

const AdminPosts = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getPendingPosts(1, 50);
      if (response.thành_công) {
        setPendingPosts(response.dữ_liệu);
      }
    } catch (error) {
      toast.error("Lỗi khi tải bài đăng");
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      const response = await postAPI.approvePost(postId);
      if (response.thành_công) {
        toast.success("Duyệt bài đăng thành công");
        setPendingPosts(pendingPosts.filter((p) => p._id !== postId));
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
        setPendingPosts(pendingPosts.filter((p) => p._id !== postId));
      }
    } catch (error) {
      toast.error("Lỗi khi từ chối bài đăng");
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
          📝 Bài đăng chờ duyệt
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Có {pendingPosts.length} bài đăng đang chờ duyệt
        </p>
      </div>

      {pendingPosts.length > 0 ? (
        <div className="space-y-4">
          {pendingPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {post.title}
                  </h3>
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
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                      👤 {post.authorId?.fullName || "Ẩn danh"}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">
                      📅 {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprovePost(post._id)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                  >
                    ✅ Duyệt
                  </button>
                  <button
                    onClick={() => handleRejectPost(post._id)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transform transition-all duration-300"
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
            Không có bài đăng chờ duyệt
          </h3>
          <p className="text-gray-600">Tất cả bài đăng đã được xử lý</p>
        </div>
      )}
    </div>
  );
};

export default AdminPosts;
