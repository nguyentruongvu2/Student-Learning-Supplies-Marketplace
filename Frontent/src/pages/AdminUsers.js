import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { userAPI } from "../services/apiService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers(1, 100);
      if (response.thành_công) {
        setUsers(response.dữ_liệu || []);
      }
    } catch (error) {
      toast.error("Lỗi khi tải người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus; // Đảo ngược trạng thái
      const lockReason = !newStatus ? "Khóa bởi admin" : null;

      await userAPI.lockUnlockUser(userId, newStatus, lockReason);

      if (newStatus) {
        toast.success("Đã mở khóa tài khoản thành công!");
      } else {
        toast.success("Đã khóa tài khoản thành công!");
      }

      fetchUsers();
    } catch (error) {
      console.error("Error toggling lock:", error);
      toast.error(
        error.response?.data?.tin_nhan ||
          "Lỗi khi thay đổi trạng thái tài khoản"
      );
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa tài khoản "${userName}"?\n\nHành động này không thể hoàn tác!`
      )
    ) {
      return;
    }

    try {
      await userAPI.deleteUser(userId);
      toast.success("Đã xóa tài khoản thành công!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi xóa tài khoản");
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
          👥 Quản lý người dùng
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Tổng số: {users.length} người dùng
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-red-500 to-orange-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Họ tên</th>
                <th className="px-6 py-4 text-left font-bold">Email</th>
                <th className="px-6 py-4 text-left font-bold">Vai trò</th>
                <th className="px-6 py-4 text-left font-bold">Trạng thái</th>
                <th className="px-6 py-4 text-left font-bold">Ngày tạo</th>
                <th className="px-6 py-4 text-center font-bold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {user.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role === "admin" ? "🛡️ Admin" : "👤 User"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.isActive ? "✅ Hoạt động" : "🔒 Bị khóa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.role !== "admin" && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleLock(user._id, user.isActive)
                          }
                          className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                            user.isActive
                              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg"
                              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                          }`}
                        >
                          {user.isActive ? "🔒 Khóa" : "🔓 Mở khóa"}
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteUser(user._id, user.fullName)
                          }
                          className="px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-red-600 to-rose-700 text-white hover:shadow-lg"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
