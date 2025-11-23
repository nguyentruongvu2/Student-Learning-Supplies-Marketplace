import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postAPI } from "../services/apiService";
import PostCard from "../components/PostCard";

const SavedPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getSavedPosts();
      if (response.thành_công) {
        setPosts(response.dữ_liệu);
      } else {
        toast.error(response.tin_nhan || "Không thể tải bài đăng đã lưu");
      }
    } catch (error) {
      console.error("Error loading saved posts:", error);
      toast.error("Lỗi khi tải bài đăng đã lưu");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ⭐ Bài đăng đã lưu
          </h1>
          <p className="text-gray-600">
            Các bài đăng bạn đã đánh dấu để xem sau
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Chưa có bài đăng nào được lưu
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa lưu bài đăng nào. Hãy khám phá và lưu những bài đăng yêu
              thích!
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => navigate(`/posts/${post._id}`)}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
