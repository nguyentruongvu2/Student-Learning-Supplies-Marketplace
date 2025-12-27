import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { userAPI } from "../services/apiService";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSchool,
  MdBook,
  MdChat,
  MdEdit,
  MdSave,
  MdClose,
  MdCamera,
  MdInfo,
  MdWarning,
  MdCheckCircle,
  MdKeyboardArrowDown,
  MdArticle,
  MdStar,
  MdVisibility,
} from "react-icons/md";
import { resolveUrl } from "../utils/resolveUrl";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [showWarnings, setShowWarnings] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    university: "",
    major: "",
    bio: "",
    address: "",
  });

  const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

  useEffect(() => {
    if (user?.id || currentUserId) {
      fetchProfile(user?.id || currentUserId);
      fetchWarnings(user?.id || currentUserId);
    }
  }, [user?.id, currentUserId]);

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const response = await userAPI.getUserProfile(userId);
      if (response.thành_công) {
        setProfile(response.dữ_liệu);
        setFormData({
          fullName: response.dữ_liệu.fullName || "",
          phone: response.dữ_liệu.phone || "",
          university: response.dữ_liệu.university || "",
          major: response.dữ_liệu.major || "",
          bio: response.dữ_liệu.bio || "",
          address: response.dữ_liệu.address || "",
        });
      } else {
        toast.error(response.tin_nhan || "Không thể tải hồ sơ");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi tải hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const fetchWarnings = async (userId) => {
    try {
      const response = await userAPI.getUserWarnings(userId);
      if (response.thành_công) {
        setWarnings(response.dữ_liệu || []);
      }
    } catch (error) {
      console.error("Error loading warnings:", error);
    }
  };

  const handleMarkAsRead = async (warningId) => {
    try {
      const response = await userAPI.markWarningAsRead(
        currentUserId,
        warningId
      );
      if (response.thành_công) {
        setWarnings(
          warnings.map((w) =>
            w._id === warningId ? { ...w, isRead: true } : w
          )
        );
        toast.success("Đã đánh dấu đã đọc");
      }
    } catch (error) {
      console.error("Error marking warning as read:", error);
      toast.error("Không thể đánh dấu đã đọc");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh tối đa 5MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      let profileUpdateData = { ...formData };

      // Upload avatar if selected
      if (avatarFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", avatarFile);

        try {
          const uploadResponse = await fetch(
            "http://localhost:5000/api/upload/avatar",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: uploadFormData,
            }
          );
          const uploadData = await uploadResponse.json();

          if (uploadData.thành_công && uploadData.dữ_liệu?.url) {
            profileUpdateData.avatar = uploadData.dữ_liệu.url;
          }
        } catch (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          toast.warning("Không thể tải ảnh lên, sẽ lưu thông tin khác");
        }
      }

      const response = await userAPI.updateUserProfile(
        currentUserId,
        profileUpdateData
      );
      if (response.thành_công) {
        const updatedProfile = response.dữ_liệu;
        setProfile(updatedProfile);

        // Update localStorage user data
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const updatedUser = { ...currentUser, ...updatedProfile };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Trigger storage event for App.js to update
        window.dispatchEvent(new Event("storage"));

        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        toast.success(response.tin_nhan || "Cập nhật hồ sơ thành công");

        // Reload profile to ensure fresh data
        fetchProfile(currentUserId);
      } else {
        toast.error(response.tin_nhan || "Không thể cập nhật hồ sơ");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi cập nhật hồ sơ");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <MdClose className="text-4xl text-white" />
          </div>
          <p className="text-gray-600 text-lg">Không thể tải hồ sơ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Cover */}
          <div className="h-24 bg-blue-600"></div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar & Header */}
            <div className="flex items-end gap-4 mb-6">
              <div className="relative">
                {avatarPreview || profile.avatar ? (
                  <img
                    src={resolveUrl(avatarPreview || profile.avatar)}
                    alt="Avatar"
                    className="w-24 h-24 rounded-xl object-cover shadow-lg border-4 border-white -mt-12"
                  />
                ) : (
                  <div className="w-24 h-24 bg-purple-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white -mt-12">
                    {profile.fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
                    <MdCamera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-2xl font-bold text-gray-800">
                  {profile.fullName}
                </h1>
                <p className="text-sm text-gray-600">{profile.email}</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <MdEdit />
                  Chỉnh sửa
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <MdArticle className="text-2xl text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.max(0, profile.postsCount || 0)}
                </p>
                <p className="text-xs text-gray-600">Bài đăng</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <MdStar className="text-2xl text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {Math.max(0, profile.rating || 0)}
                </p>
                <p className="text-xs text-gray-600">Đánh giá</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <MdVisibility className="text-2xl text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(0, profile.viewsCount || 0)}
                </p>
                <p className="text-xs text-gray-600">Lượt xem</p>
              </div>
            </div>

            {isEditing ? (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Chỉnh sửa hồ sơ
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <MdPerson className="text-blue-600" />
                        Họ tên
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <MdEmail className="text-blue-600" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <MdPhone className="text-blue-600" />
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <MdLocationOn className="text-blue-600" />
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <MdSchool className="text-blue-600" />
                        Trường
                      </label>
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                        <MdBook className="text-blue-600" />
                        Ngành học
                      </label>
                      <input
                        type="text"
                        name="major"
                        value={formData.major}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                      <MdChat className="text-blue-600" />
                      Giới thiệu
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm resize-none"
                      rows="3"
                      placeholder="Viết vài điều về bản thân..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <MdSave />
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setAvatarFile(null);
                        setAvatarPreview(null);
                        setFormData({
                          fullName: profile.fullName || "",
                          phone: profile.phone || "",
                          university: profile.university || "",
                          major: profile.major || "",
                          bio: profile.bio || "",
                          address: profile.address || "",
                        });
                      }}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <MdClose />
                      Hủy
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MdInfo className="text-blue-600" />
                  Thông tin cá nhân
                </h2>
                <div className="space-y-4 mb-8 bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <MdSchool className="text-blue-600" />
                      Trường:
                    </span>
                    <span className="font-bold text-gray-800">
                      {profile.university || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <MdBook className="text-blue-600" />
                      Ngành:
                    </span>
                    <span className="font-bold text-gray-800">
                      {profile.major || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <MdPhone className="text-blue-600" />
                      Số điện thoại:
                    </span>
                    <span className="font-bold text-gray-800">
                      {profile.phone || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <MdLocationOn className="text-blue-600" />
                      Địa chỉ:
                    </span>
                    <span className="font-bold text-gray-800">
                      {profile.address || "—"}
                    </span>
                  </div>
                  {profile.bio && (
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-600 font-medium flex items-center gap-2 mb-2">
                        <MdChat className="text-blue-600" />
                        Giới thiệu:
                      </span>
                      <span className="font-medium text-gray-800">
                        {profile.bio}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <MdEdit />
                  Chỉnh sửa hồ sơ
                </button>
              </>
            )}
          </div>
        </div>

        {/* Warnings Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-6">
          <button
            onClick={() => setShowWarnings(!showWarnings)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-800">
                  Cảnh báo từ quản trị
                </h2>
                <p className="text-sm text-gray-600">
                  {warnings.length > 0
                    ? `${warnings.length} cảnh báo${
                        warnings.filter((w) => !w.isRead).length > 0
                          ? ` (${
                              warnings.filter((w) => !w.isRead).length
                            } chưa đọc)`
                          : ""
                      }`
                    : "Không có cảnh báo"}
                </p>
              </div>
            </div>
            <div
              className={`transform transition-transform ${
                showWarnings ? "rotate-180" : ""
              }`}
            >
              🔽
            </div>
          </button>

          {showWarnings && (
            <div className="px-6 pb-6">
              {warnings.length > 0 ? (
                <div className="space-y-3">
                  {warnings.map((warning) => (
                    <div
                      key={warning._id}
                      className={`p-4 rounded-xl border-2 ${
                        warning.isRead
                          ? "bg-gray-50 border-gray-200"
                          : "bg-red-50 border-red-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          {!warning.isRead && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                          {warning.reason}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(warning.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 bg-white px-3 py-2 rounded-lg border border-gray-200">
                        {warning.adminResponse}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Bởi: {warning.adminId?.fullName || "Admin"}
                        </span>
                        {!warning.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(warning._id)}
                            className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                          >
                            ✓ Đánh dấu đã đọc
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-dashed border-green-300">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gray-600">
                    Không có cảnh báo. Hãy tiếp tục giữ vững!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
