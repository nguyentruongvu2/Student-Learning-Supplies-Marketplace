import React, { useState } from "react";
import { FaEye, FaComment, FaHeart, FaMapMarkerAlt } from "react-icons/fa";

const PostCard = ({ post, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden hover:scale-105 duration-300 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden group">
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
            {post.images.length > 1 && (
              <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs font-bold">
                +{post.images.length - 1}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
            📷
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          {post.category}
        </div>

        {/* Status Badge - Only show if not approved */}
        {post.status && post.status !== "chap_nhan" && (
          <div className="absolute bottom-3 left-3 bg-yellow-400 text-gray-800 px-2 py-1 rounded text-xs font-bold shadow-lg">
            {post.status === "cho_duyet" && "⏳ Chờ duyệt"}
            {post.status === "tu_choi" && "❌ Từ chối"}
            {post.status === "da_ban" && "✅ Đã bán"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-2">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {post.description}
        </p>

        {/* Location */}
        {post.location && (
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <FaMapMarkerAlt className="mr-2 text-red-500" />
            <span className="line-clamp-1">{post.location}</span>
          </div>
        )}

        {/* Price / Exchange */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          {post.postType === "ban" ? (
            <span className="text-2xl font-bold text-green-600">
              {post.price?.toLocaleString("vi-VN")} đ
            </span>
          ) : (
            <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              🔄 Trao đổi
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-gray-500 text-sm">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 hover:text-blue-600">
              <FaEye /> <span>{post.viewCount || 0}</span>
            </span>
            <span className="flex items-center space-x-1 hover:text-blue-600">
              <FaComment /> <span>{post.commentCount || 0}</span>
            </span>
            <span className="flex items-center space-x-1 hover:text-red-600">
              <FaHeart /> <span>{post.saveCount || 0}</span>
            </span>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-semibold text-gray-600">
            {post.condition || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
