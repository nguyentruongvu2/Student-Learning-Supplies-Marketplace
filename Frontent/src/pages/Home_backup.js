import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
import PostCard from "../components/PostCard";
import { postAPI } from "../services/apiService";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [postType, setPostType] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    fetchPosts(1);
  }, [category, postType, search]);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await postAPI.getAllPosts(
        pageNum,
        12,
        category || null,
        postType || null,
        search || null
      );

      if (response.thành_công) {
        setPosts(response.dữ_liệu);
        setPage(response.trang_hiện_tại);
      } else {
        toast.warning(response.tin_nhan || "Không có bài đăng nào");
        setPosts([]);
      }
    } catch (error) {
      // Nếu không có kết nối, hiển thị dữ liệu mô phỏng
      console.warn("Không thể kết nối API, sử dụng dữ liệu mô phỏng");
      setPosts([
        {
          _id: "1",
          title: "Bán sách Giải tích 1",
          description:
            "Sách Giải tích 1, tái bản lần thứ 5, tình trạng như mới",
          price: 150000,
          category: "Sách",
          postType: "ban",
          images: [],
          views: 245,
          commentsCount: 12,
          authorId: { fullName: "Nguyễn Văn A", avatar: null },
        },
        {
          _id: "2",
          title: "Trao đổi máy tính Casio",
          description: "Trao đổi máy tính Casio cấp 3, cần máy tính khoa học",
          price: null,
          category: "Máy tính & Điện tử",
          postType: "trao_doi",
          images: [],
          views: 156,
          commentsCount: 8,
          authorId: { fullName: "Trần Thị B", avatar: null },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400 rounded-full opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              🎓 Sàn giao dịch sinh viên
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
              Trao đổi & Bán dụng cụ học tập một cách dễ dàng, an toàn và nhanh chóng
            </p>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài đăng..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                >
                  <option value="">Tất cả danh mục</option>
                  <option value="Sách">📖 Sách</option>
                  <option value="Bút & Giấy">✏️ Bút & Giấy</option>
                  <option value="Máy tính & Điện tử">💻 Máy tính & Điện tử</option>
                  <option value="Quần áo">👕 Quần áo</option>
                  <option value="Khác">📦 Khác</option>
                </select>
              </div>

              {/* Post Type Filter */}
              <div>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                >
                  <option value="">Tất cả loại</option>
                  <option value="ban">💰 Bán</option>
                  <option value="trao_doi">🔄 Trao đổi</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onClick={() => navigate(`/posts/${post._id}`)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy bài đăng</h3>
            <p className="text-gray-600">Hãy thử thay đổi bộ lọc hoặc tạo bài đăng mới</p>
          </div>
        )}
      </div>
    </div>
  );
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Nền tảng kết nối sinh viên mua bán và trao đổi dụng cụ học tập
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm bài đăng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
              <FaFilter /> <span>Bộ lọc</span>
            </button>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none"
            >
              <option value="">Tất cả danh mục</option>
              <option value="Sách">Sách</option>
              <option value="Bút & Giấy">Bút & Giấy</option>
              <option value="Máy tính & Điện tử">Máy tính & Điện tử</option>
              <option value="Quần áo">Quần áo</option>
              <option value="Khác">Khác</option>
            </select>

            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none"
            >
              <option value="">Tất cả loại</option>
              <option value="ban">Bán</option>
              <option value="trao_doi">Trao đổi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onClick={() => navigate(`/posts/${post._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Không có bài đăng nào phù hợp
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
