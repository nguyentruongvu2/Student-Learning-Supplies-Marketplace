import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaComments,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaChevronDown,
} from "react-icons/fa";

const Navbar = ({ user, isAuthenticated }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-3xl">🎓</div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Chợ Sinh Viên
            </span>
          </Link>

          {/* Điều hướng trung tâm */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <FaHome /> <span>Trang chủ</span>
            </Link>
          </div>

          {/* Điều hướng bên phải */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <FaPlus /> <span>Đăng bài</span>
                </Link>
                <Link to="/chat" className="text-gray-600 hover:text-blue-600">
                  <FaComments size={20} />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">
                      {user?.fullName?.split(" ")[0]}
                    </span>
                    <FaChevronDown size={12} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-b"
                      >
                        📊 Bảng điều khiển
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        👤 Hồ sơ
                      </Link>
                      <Link
                        to="/my-posts"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        📝 Bài đăng của tôi
                      </Link>
                      <Link
                        to="/saved-posts"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        ⭐ Bài đăng đã lưu
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-t"
                        >
                          ⚙️ Quản trị
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t"
                      >
                        <FaSignOutAlt /> <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Đăng ký
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
