import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaChartBar,
  FaClipboardList,
  FaExclamationTriangle,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/admin/stats", label: "Thống kê", icon: <FaChartBar /> },
    { path: "/admin/posts", label: "Bài đăng", icon: <FaClipboardList /> },
    {
      path: "/admin/reports",
      label: "Báo cáo",
      icon: <FaExclamationTriangle />,
    },
    { path: "/admin/users", label: "Người dùng", icon: <FaUsers /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 bg-gradient-to-b from-red-600 to-orange-600 shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto
        `}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/30">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🛡️ Quản trị
              </h2>
              <p className="text-red-100 text-sm mt-1">Admin Panel</p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
                  ${
                    isActive(item.path)
                      ? "bg-white text-red-600 shadow-lg"
                      : "text-white hover:bg-white/20"
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="pt-4 border-t border-white/30">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-white hover:bg-white/20 transition-all duration-200"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Đăng xuất</span>
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-white text-sm">
              💡 <strong>Mẹo:</strong> Sử dụng menu bên trái để điều hướng nhanh
              giữa các chức năng quản trị.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
