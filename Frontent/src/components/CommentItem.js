import React, { useState, useEffect } from "react";
import { resolveUrl } from "../utils/resolveUrl";
import { commentAPI } from "../services/apiService";
import { toast } from "react-toastify";

const REACTIONS = [
  { type: "like", emoji: "👍", label: "Thích" },
  { type: "love", emoji: "❤️", label: "Yêu thích" },
  { type: "haha", emoji: "😂", label: "Haha" },
  { type: "wow", emoji: "😮", label: "Wow" },
  { type: "sad", emoji: "😢", label: "Buồn" },
  { type: "angry", emoji: "😠", label: "Phẫn nộ" },
];

const CommentItem = ({
  comment,
  currentUserId,
  onReply,
  onReport,
  onDelete,
  onRefresh,
  isReply = false,
  rootCommentId = null,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [localComment, setLocalComment] = useState(comment);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync localComment khi comment prop thay đổi
  useEffect(() => {
    setLocalComment(comment);
  }, [comment]);

  // Tính tổng reactions
  const getTotalReactions = () => {
    if (!localComment.reactions) return 0;
    return Object.values(localComment.reactions).reduce(
      (sum, arr) => sum + (arr?.length || 0),
      0
    );
  };

  // Kiểm tra user đã react chưa
  const getUserReaction = () => {
    if (!localComment.reactions || !currentUserId) return null;
    for (const [type, users] of Object.entries(localComment.reactions)) {
      if (
        users?.some((id) => id === currentUserId || id._id === currentUserId)
      ) {
        return type;
      }
    }
    return null;
  };

  // Xử lý reaction
  const handleReaction = async (reactionType) => {
    if (!currentUserId) {
      toast.error("Vui lòng đăng nhập để thả cảm xúc");
      return;
    }

    try {
      console.log("🎭 Reacting:", reactionType);
      const response = await commentAPI.reactToComment(
        localComment._id,
        reactionType
      );
      if (response.thành_công) {
        console.log("✅ Reaction successful, refreshing...");
        setShowReactions(false);
        // Fetch lại để cập nhật tất cả comments
        if (onRefresh) {
          await onRefresh();
        }
      }
    } catch (error) {
      console.error("Lỗi khi react:", error);
      toast.error("Không thể thả cảm xúc");
    }
  };

  // Xử lý reply
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setReplyLoading(true);
    try {
      // Truyền rootCommentId nếu đang reply vào reply
      const targetRootId = isReply ? rootCommentId : null;
      console.log("💬 Replying to:", localComment._id, "rootId:", targetRootId);
      await onReply(localComment._id, replyContent, targetRootId);

      setReplyContent("");
      setShowReplyForm(false);
      toast.success("Đã trả lời bình luận");
      // Refresh parent để hiện reply mới
      console.log("✅ Reply successful, refreshing...");
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Lỗi khi reply:", error);
      toast.error("Không thể trả lời bình luận");
    } finally {
      setReplyLoading(false);
    }
  };

  // Xử lý xóa comment
  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    setIsDeleting(true);
    try {
      console.log("🗑️ Deleting comment:", localComment._id);
      await onDelete(
        localComment._id,
        isReply ? localComment.parentCommentId : null
      );
      toast.success("Đã xóa bình luận");
      // Refresh parent để cập nhật UI
      console.log("✅ Delete successful, refreshing...");
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Không thể xóa bình luận");
      setIsDeleting(false);
    }
  };

  const userReaction = getUserReaction();
  const totalReactions = getTotalReactions();

  return (
    <div className={`${isReply ? "ml-12" : ""}`}>
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            {/* Avatar */}
            <img
              src={
                resolveUrl(localComment.commenterId?.avatar) ||
                "https://via.placeholder.com/40?text=👤"
              }
              alt=""
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/40?text=👤";
              }}
            />

            <div className="flex-1">
              {/* Tên + Nội dung */}
              <div className="bg-white px-4 py-2 rounded-2xl inline-block">
                <p className="font-bold text-sm">
                  {localComment.commenterId?.fullName || "Ẩn danh"}
                </p>
                {localComment.rating && (
                  <div className="text-sm text-yellow-400 my-1">
                    {"★".repeat(localComment.rating)}
                    {"☆".repeat(5 - localComment.rating)}
                  </div>
                )}
                <p className="text-sm text-gray-700">{localComment.content}</p>
              </div>

              {/* Reactions hiển thị */}
              {totalReactions > 0 && (
                <div className="flex items-center gap-1 mt-1 ml-2">
                  <div className="flex -space-x-1">
                    {Object.entries(localComment.reactions || {}).map(
                      ([type, users]) => {
                        if (!users || users.length === 0) return null;
                        const reaction = REACTIONS.find((r) => r.type === type);
                        return (
                          <span
                            key={type}
                            className="text-xs bg-white rounded-full px-1 border"
                          >
                            {reaction?.emoji}
                          </span>
                        );
                      }
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {totalReactions}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 mt-2 ml-2 relative">
                {/* React button */}
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className={`text-xs font-semibold ${
                    userReaction ? "text-blue-600" : "text-gray-600"
                  } hover:underline`}
                >
                  {userReaction
                    ? REACTIONS.find((r) => r.type === userReaction)?.emoji +
                      " "
                    : ""}
                  {userReaction
                    ? REACTIONS.find((r) => r.type === userReaction)?.label
                    : "Thích"}
                </button>

                {/* Reply button - hiện cho tất cả */}
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-xs font-semibold text-gray-600 hover:underline"
                >
                  Trả lời
                </button>

                {/* Thời gian */}
                <span className="text-xs text-gray-500">
                  {localComment.createdAt
                    ? new Date(localComment.createdAt).toLocaleDateString(
                        "vi-VN"
                      )
                    : ""}
                </span>

                {/* Delete - chỉ hiện cho comment của mình */}
                {currentUserId &&
                  (localComment.commenterId?._id === currentUserId ||
                    localComment.commenterId?.id === currentUserId) && (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold"
                      title="Xóa bình luận"
                    >
                      {isDeleting ? "⏳" : "Xóa"}
                    </button>
                  )}

                {/* Report */}
                <button
                  onClick={() =>
                    onReport(localComment._id, localComment.commenterId)
                  }
                  className="text-xs text-red-500 hover:text-red-700"
                  title="Báo cáo"
                >
                  🚩
                </button>

                {/* Reactions dropdown */}
                {showReactions && (
                  <div className="absolute top-full mt-1 bg-white shadow-lg rounded-full px-2 py-1 flex gap-1 z-10 border">
                    {REACTIONS.map((reaction) => (
                      <button
                        key={reaction.type}
                        onClick={() => handleReaction(reaction.type)}
                        className="text-lg hover:scale-125 transition-transform"
                        title={reaction.label}
                      >
                        {reaction.emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply form */}
              {showReplyForm && (
                <form onSubmit={handleReplySubmit} className="mt-3 ml-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Viết trả lời..."
                      className="flex-1 px-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={replyLoading || !replyContent.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      {replyLoading ? "⏳" : "➤"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      {!isReply && localComment.replies && localComment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {localComment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              onReport={onReport}
              onDelete={onDelete}
              onRefresh={onRefresh}
              isReply={true}
              rootCommentId={rootCommentId || localComment._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
