import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBars, FaChevronDown } from "react-icons/fa";
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
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search to history
  const saveSearchToHistory = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") return;

    const trimmedSearch = searchTerm.trim();
    let history = [...searchHistory];

    // Remove if already exists
    history = history.filter((item) => item !== trimmedSearch);

    // Add to beginning
    history.unshift(trimmedSearch);

    // Keep only last 10
    history = history.slice(0, 10);

    setSearchHistory(history);
    localStorage.setItem("searchHistory", JSON.stringify(history));
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const searchSuggestions = [
    "📚 Sách giáo khoa",
    "📓 Vở ghi chú",
    "✏️ Bút bi",
    "💻 Laptop",
    "📱 Điện thoại",
    "🎒 Ba lô",
    "👕 Áo lớp",
    "📐 Thước kẻ",
    "🖊️ Bút máy",
    "📖 Sách tham khảo",
  ];

  useEffect(() => {
    setPage(1);
    setHasActiveFilters(!!(category || postType || search));
    fetchPosts(1);
  }, [category, postType, search]);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);

      // Save search term to history when user searches
      if (search && search.trim()) {
        saveSearchToHistory(search);
      }

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
        setPosts([]);
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error.message);
      toast.error("Không thể tải bài đăng. Vui lòng kiểm tra kết nối!");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white py-24 relative">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-300 opacity-10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 opacity-10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              ✨ Nền tảng mua bán đồ sinh viên #1
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">
              🎓 Chợ Sinh Viên
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 max-w-3xl mx-auto font-medium leading-relaxed">
              Nơi sinh viên mua bán, trao đổi đồ cũ
              <br />
              💙 Tiết kiệm - An toàn - Nhanh chóng
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 max-w-4xl mx-auto mb-8 border border-white/40 relative z-50">
            <div className="relative">
              <FaSearch className="absolute left-5 top-4 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="🔍 Tìm kiếm sách, đồ dùng học tập..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-14 pr-5 py-4 text-base text-gray-800 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all placeholder-gray-400"
              />

              {/* Search Suggestions Dropdown */}
              {showSuggestions && search.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slideDown">
                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <>
                      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-700">
                          🕐 Lịch sử tìm kiếm
                        </p>
                        <button
                          onClick={clearSearchHistory}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold"
                        >
                          Xóa tất cả
                        </button>
                      </div>
                      <div className="max-h-40 overflow-y-auto border-b border-gray-200">
                        {searchHistory.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearch(item);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                          >
                            <span className="text-gray-400">🕐</span>
                            <span className="flex-1 group-hover:text-purple-600 font-medium">
                              {item}
                            </span>
                            <FaSearch className="text-gray-400 group-hover:text-purple-500 text-xs" />
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Popular Suggestions */}
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <p className="text-sm font-bold text-gray-700">
                      💡 Gợi ý tìm kiếm phổ biến
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearch(suggestion.substring(2)); // Remove emoji
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                      >
                        <span className="text-lg">
                          {suggestion.substring(0, 2)}
                        </span>
                        <span className="flex-1 group-hover:text-blue-600 font-medium">
                          {suggestion.substring(2)}
                        </span>
                        <FaSearch className="text-gray-400 group-hover:text-blue-500 text-xs" />
                      </button>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      💡 Nhập từ khóa để tìm kiếm
                    </p>
                  </div>
                </div>
              )}

              {/* Search Results Count */}
              {search.length > 0 && (
                <div className="absolute right-5 top-4">
                  <button
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filters Section - Dropdown Style */}
          <div className="max-w-3xl mx-auto mb-8 relative z-50">
            <div className="flex gap-4 justify-center flex-wrap">
              {/* Category Dropdown */}
              <div className="relative z-50">
                <button
                  onClick={() => {
                    setShowCategoryMenu(!showCategoryMenu);
                    setShowTypeMenu(false);
                  }}
                  className="bg-white/90 backdrop-blur hover:bg-white hover:scale-105 text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 hover:shadow-2xl min-w-[200px] border border-white/50"
                >
                  <FaBars className="text-blue-500" />
                  <span className="flex-1 text-left">
                    {category ? (
                      <>
                        {category === "Sách" && "📖 Sách"}
                        {category === "Bút & Giấy" && "✏️ Bút & Giấy"}
                        {category === "Máy tính & Điện tử" &&
                          "💻 Máy tính & Điện tử"}
                        {category === "Quần áo" && "👕 Quần áo"}
                        {category === "Khác" && "📦 Khác"}
                      </>
                    ) : (
                      "📚 Danh mục"
                    )}
                  </span>
                  <FaChevronDown
                    className={`text-gray-400 text-sm transition-transform ${
                      showCategoryMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showCategoryMenu && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-slideDown z-[100]">
                    {[
                      { value: "", label: "🔹 Tất cả danh mục" },
                      { value: "Sách", label: "📖 Sách" },
                      { value: "Bút & Giấy", label: "✏️ Bút & Giấy" },
                      {
                        value: "Máy tính & Điện tử",
                        label: "💻 Máy tính & Điện tử",
                      },
                      { value: "Quần áo", label: "👕 Quần áo" },
                      { value: "Khác", label: "📦 Khác" },
                    ].map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          setCategory(cat.value);
                          setShowCategoryMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                          category === cat.value
                            ? "bg-blue-100 font-semibold text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Type Dropdown */}
              <div className="relative z-50">
                <button
                  onClick={() => {
                    setShowTypeMenu(!showTypeMenu);
                    setShowCategoryMenu(false);
                  }}
                  className="bg-white/90 backdrop-blur hover:bg-white hover:scale-105 text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 hover:shadow-2xl min-w-[200px] border border-white/50"
                >
                  <FaBars className="text-amber-500" />
                  <span className="flex-1 text-left">
                    {postType ? (
                      <>
                        {postType === "ban" && "💰 Bán sản phẩm"}
                        {postType === "trao_doi" && "🔄 Trao đổi"}
                      </>
                    ) : (
                      "🏷️ Loại giao dịch"
                    )}
                  </span>
                  <FaChevronDown
                    className={`text-gray-400 text-sm transition-transform ${
                      showTypeMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showTypeMenu && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-slideDown z-[100]">
                    {[
                      { value: "", label: "🔹 Tất cả loại" },
                      { value: "ban", label: "💰 Bán sản phẩm" },
                      { value: "trao_doi", label: "🔄 Trao đổi" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => {
                          setPostType(type.value);
                          setShowTypeMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors ${
                          postType === type.value
                            ? "bg-amber-100 font-semibold text-amber-700"
                            : "text-gray-700"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin shadow-lg"></div>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                📋 Danh sách sản phẩm
              </h2>
              <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                {posts.length} kết quả
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-2xl"
                >
                  <PostCard
                    post={post}
                    onClick={() => navigate(`/posts/${post._id}`)}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-16 border border-blue-100 shadow-lg">
            <div className="text-center">
              <div className="text-7xl mb-6 animate-pulse">📭</div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                {hasActiveFilters
                  ? "Không tìm thấy kết quả phù hợp"
                  : "Chưa có bài đăng nào"}
              </h3>

              {/* Show current filters */}
              {hasActiveFilters && (
                <div className="bg-white rounded-xl p-4 mb-6 max-w-2xl mx-auto">
                  <p className="text-sm font-bold text-gray-700 mb-3">
                    🔍 Bộ lọc hiện tại:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {search && (
                      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        Tìm kiếm: "{search}"
                        <button
                          onClick={() => setSearch("")}
                          className="text-blue-900 hover:text-red-600 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {category && (
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        Danh mục: {category}
                        <button
                          onClick={() => setCategory("")}
                          className="text-green-900 hover:text-red-600 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {postType && (
                      <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        Loại: {postType === "ban" ? "Bán" : "Trao đổi"}
                        <button
                          onClick={() => setPostType("")}
                          className="text-amber-900 hover:text-red-600 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              <p className="text-gray-600 text-lg mb-6">
                {hasActiveFilters
                  ? "Hãy thử xóa một số bộ lọc hoặc tìm kiếm từ khóa khác"
                  : "Hãy tạo bài đăng đầu tiên của bạn"}
              </p>

              <div className="flex gap-3 justify-center flex-wrap">
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setCategory("");
                      setPostType("");
                      setSearch("");
                    }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    🔄 Xóa tất cả bộ lọc
                  </button>
                )}
                <button
                  onClick={() => navigate("/create-post")}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  ✍️ Tạo bài đăng mới
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
