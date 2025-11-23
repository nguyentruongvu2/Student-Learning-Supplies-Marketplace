import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { postAPI } from "../services/apiService";

const SaveButton = ({ postId, isSaved = false, onToggle }) => {
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);

  // Cập nhật state khi prop isSaved thay đổi
  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("⚠️ Vui lòng đăng nhập để lưu bài đăng");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }

    try {
      setLoading(true);
      const response = await postAPI.savePost(postId);

      if (response.thành_công) {
        setSaved(!saved);
        toast.success(saved ? "Đã bỏ lưu bài đăng" : "Đã lưu bài đăng");
        if (onToggle) {
          onToggle(!saved);
        }
      } else {
        toast.error(response.tin_nhan || "Lỗi cập nhật");
      }
    } catch (error) {
      console.error("Lỗi lưu bài đăng:", error);
      toast.error("Lỗi khi lưu bài đăng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
        saved
          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      {saved ? "⭐ Đã lưu" : "☆ Lưu"}
    </button>
  );
};

export default SaveButton;
