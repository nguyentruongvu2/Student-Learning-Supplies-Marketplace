import React, { useState } from "react";
import {
  FaEye,
  FaComment,
  FaHeart,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

/**
 * Component PostCard - Hiển thị thông tin bài đăng dạng thẻ
 * Được sử dụng trong danh sách bài đăng, trang chủ
 */
const PostCard = ({ post, onClick }) => {
  const [imageError, setImageError] = useState(false);

  // Hàm tính thời gian đã đăng (relative time)
  const getTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const seconds = Math.floor((now - postDate) / 1000);

    if (seconds < 60) return "Vừa xong";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} tuần trước`;
    return `${Math.floor(seconds / 2592000)} tháng trước`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-xl transition-all cursor-pointer overflow-hidden hover:scale-105 duration-200 border border-gray-200"
    >
      {/* Container hình ảnh */}
      <div className="relative w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden group">
        {post.images && post.images.length > 0 && !imageError ? (
          <>
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              onError={() => {
                console.warn("Image load error for post:", post._id);
                setImageError(true);
              }}
            />
            {/* Badge hiển thị số lượng ảnh */}
            {post.images.length > 1 && (
              <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs font-bold">
                +{post.images.length - 1}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
            📷
          </div>
        )}

        {/* Category Badge - Smaller */}
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold shadow">
          {post.category}
        </div>

        {/* Status Badge - Only show if not approved */}
        {post.status && post.status !== "chap_nhan" && (
          <div className="absolute bottom-2 left-2 bg-yellow-400 text-gray-800 px-2 py-0.5 rounded text-xs font-bold shadow">
            {post.status === "cho_duyet" && "⏳"}
            {post.status === "tu_choi" && "❌"}
            {post.status === "da_ban" && "✅"}
          </div>
        )}
      </div>

      {/* Content - More Compact */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mb-2 min-h-[2.5rem]">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-2 min-h-[2rem]">
          {post.description}
        </p>

        {/* Location & Condition */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2 pb-2 border-b border-gray-100">
          {post.location && (
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-red-500" />
              <span className="line-clamp-1">{post.location}</span>
            </div>
          )}
          {post.condition && (
            <span className="bg-gray-100 px-2 py-0.5 rounded font-semibold">
              {post.condition}
            </span>
          )}
        </div>

        {/* Price / Exchange - Compact */}
        <div className="mb-2">
          {post.postType === "ban" ? (
            <span className="text-lg font-bold text-green-600">
              {post.price?.toLocaleString("vi-VN")} đ
            </span>
          ) : (
            <span className="inline-block bg-purple-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
              🔄 Trao đổi
            </span>
          )}
        </div>

        {/* Author Info */}
        {post.authorId && (
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
              {post.authorId.fullName?.charAt(0).toUpperCase()}
            </div>
            <span className="line-clamp-1">{post.authorId.fullName}</span>
          </div>
        )}

        {/* Time Posted */}
        {post.createdAt && (
          <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
            <FaClock className="text-[10px]" />
            <span>{getTimeAgo(post.createdAt)}</span>
          </div>
        )}

        {/* Stats - Compact */}
        <div className="flex justify-between items-center text-gray-500 text-xs border-t border-gray-100 pt-2">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1">
              <FaEye className="text-xs" /> <span>{post.viewCount || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <FaComment className="text-xs" />{" "}
              <span>{post.commentCount || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <FaHeart className="text-xs" /> <span>{post.saveCount || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
