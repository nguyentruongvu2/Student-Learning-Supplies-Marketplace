import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaComments,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaChevronDown,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

/**
 * Component Navbar - Thanh điều hướng chính của ứng dụng
 * Hiển thị menu, tìm kiếm, và thông tin người dùng
 */
const Navbar = ({
  user,
  isAuthenticated,
  onSearch,
  setIsAuthenticated,
  setUser,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();

  // Tải lịch sử tìm kiếm từ localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Lưu từ khóa tìm kiếm vào lịch sử
  const saveSearchToHistory = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") return;

    const trimmedSearch = searchTerm.trim();
    let history = [...searchHistory];

    // Xóa nếu đã tồn tại
    history = history.filter((item) => item !== trimmedSearch);

    // Thêm vào đầu danh sách
    history.unshift(trimmedSearch);

    // Giữ lại 10 tìm kiếm gần nhất
    history = history.slice(0, 10);

    setSearchHistory(history);
    localStorage.setItem("searchHistory", JSON.stringify(history));
  };

  // Xóa toàn bộ lịch sử tìm kiếm
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // Xóa một mục trong lịch sử tìm kiếm
  const removeSearchItem = (indexToRemove) => {
    const updatedHistory = searchHistory.filter(
      (_, index) => index !== indexToRemove
    );
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  // Danh sách gợi ý tìm kiếm
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

  const handleSearch = (searchTerm = search) => {
    if (searchTerm.trim()) {
      saveSearchToHistory(searchTerm);
      if (onSearch) {
        onSearch(searchTerm);
      }
      // Navigate to home page with search
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img
              src="/images/logo.jpg"
              alt="Logo"
              className="w-10 h-10 object-contain rounded-full"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Chợ đồ cũ sinh viên
            </span>
          </Link>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-2xl mx-4 relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-gray-700">
                          🕒 Tìm kiếm gần đây
                        </h3>
                        <button
                          onClick={clearSearchHistory}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Xóa
                        </button>
                      </div>
                      <div className="space-y-1">
                        {searchHistory.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition group"
                          >
                            <button
                              onClick={() => {
                                setSearch(item);
                                handleSearch(item);
                              }}
                              className="flex-1 text-left"
                            >
                              {item}
                            </button>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeSearchItem(index);
                              }}
                              className="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Xóa"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search Suggestions */}
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-700 mb-2">
                      💡 Gợi ý tìm kiếm
                    </h3>
                    <div className="space-y-1">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearch(suggestion);
                            handleSearch(suggestion);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 rounded transition"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Điều hướng bên phải */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-2 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                >
                  <FaPlus className="text-lg" /> <span>Đăng bài</span>
                </Link>
                <Link to="/chat" className="text-gray-600 hover:text-blue-600">
                  <FaComments size={20} />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.fullName}
                        className="w-8 h-8 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:inline text-sm font-semibold">
                      {user?.fullName}
                    </span>
                    <FaChevronDown className="text-xs" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-white">
                        <p className="text-sm font-semibold">
                          {user?.fullName}
                        </p>
                        <p className="text-xs opacity-90">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-lg">📊</span>
                          <span className="text-sm font-medium">
                            Bảng điều khiển
                          </span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <FaUser className="text-gray-500" />
                          <span className="text-sm font-medium">Hồ sơ</span>
                        </Link>
                        <Link
                          to="/my-posts"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-lg">📝</span>
                          <span className="text-sm font-medium">
                            Bài đăng của tôi
                          </span>
                        </Link>
                        <Link
                          to="/saved-posts"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-lg">⭐</span>
                          <span className="text-sm font-medium">
                            Bài đăng đã lưu
                          </span>
                        </Link>
                        {user?.role === "admin" && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-indigo-600 hover:bg-indigo-50 transition-colors border-t border-gray-100"
                          >
                            <FaCog className="text-indigo-600" />
                            <span className="text-sm font-semibold">
                              Quản trị
                            </span>
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-200">
                        <button
                          onClick={() => {
                            handleLogout();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FaSignOutAlt />
                          <span className="text-sm font-semibold">
                            Đăng xuất
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  <FaSignOutAlt />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                >
                  <FiLogIn className="text-lg" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                >
                  <FiUserPlus className="text-lg" />
                  <span>Đăng ký</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
