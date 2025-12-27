import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSearch, FaBars, FaChevronDown } from "react-icons/fa";
import PostCard from "../components/PostCard";
import FilterSidebar from "../components/FilterSidebar";
import BannerSlideshow from "../components/BannerSlideshow";
import { postAPI } from "../services/apiService";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [postType, setPostType] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [conditions, setConditions] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  // Sync search from URL params
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParams]);

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

  // Remove single item from search history
  const removeSearchItem = (indexToRemove) => {
    const updatedHistory = searchHistory.filter(
      (_, index) => index !== indexToRemove
    );
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
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
    setHasActiveFilters(
      !!(
        category ||
        postType ||
        search ||
        priceRange !== "all" ||
        dateFilter ||
        conditions.length > 0 ||
        sortBy !== "newest"
      )
    );
    fetchPosts(1);
  }, [category, postType, search, priceRange, dateFilter, conditions, sortBy]);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);

      // Save search term to history when user searches
      if (search && search.trim()) {
        saveSearchToHistory(search);
      }

      // Calculate price range
      const priceRanges = {
        all: { min: null, max: null },
        under50: { min: 0, max: 50000 },
        "50to100": { min: 50000, max: 100000 },
        "100to200": { min: 100000, max: 200000 },
        "200to500": { min: 200000, max: 500000 },
        over500: { min: 500000, max: null },
      };

      const selectedPriceRange = priceRanges[priceRange] || priceRanges.all;

      const response = await postAPI.getAllPosts(
        pageNum,
        12,
        category || null,
        postType || null,
        search || null,
        sortBy || "newest",
        selectedPriceRange.min,
        selectedPriceRange.max,
        dateFilter || null,
        conditions.length > 0 ? conditions.join(",") : null
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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Filter Sidebar - Always visible on desktop, hidden on mobile */}
      <FilterSidebar
        isOpen={showFilterSidebar}
        onClose={() => setShowFilterSidebar(false)}
        category={category}
        setCategory={setCategory}
        postType={postType}
        setPostType={setPostType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        conditions={conditions}
        setConditions={setConditions}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClearFilters={() => {
          setCategory("");
          setPostType("");
          setPriceRange("all");
          setDateFilter("");
          setConditions([]);
          setSortBy("newest");
        }}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Banner Slideshow */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <BannerSlideshow />
        </div>

        {/* Mobile Filter Button */}
        <div className="max-w-7xl mx-auto px-4 mb-6 lg:hidden">
          <button
            onClick={() => setShowFilterSidebar(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-2xl"
          >
            <FaBars />
            <span>Mở bộ lọc</span>
          </button>
        </div>

        {/* Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin shadow-lg"></div>
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  📋 Danh sách bài đăng
                </h2>
                <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  {posts.length} kết quả
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-xl"
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
                        setPriceRange("all");
                        setDateFilter("");
                        setConditions([]);
                        setSortBy("newest");
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
    </div>
  );
};

export default Home;
