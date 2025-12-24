import React, { useState, useEffect } from "react";
import { resolveUrl } from "../utils/resolveUrl";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postAPI, commentAPI, reportAPI } from "../services/apiService";
import SaveButton from "../components/SaveButton";
import CommentItem from "../components/CommentItem";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ reason: "", description: "" });
  const [reportType, setReportType] = useState("post"); // "post" or "comment"
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedCommentAuthor, setSelectedCommentAuthor] = useState(null);

  // Lấy user hiện tại
  const getCurrentUserId = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id || user._id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Fetch post detail
  useEffect(() => {
    fetchPostDetail();
    fetchComments();
  }, [id]);

  // Không cần fetch khi page thay đổi vì đã xử lý trong nút "Xem thêm"

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getPostDetail(id);
      if (response.thành_công) {
        console.log("Post detail loaded:", response.dữ_liệu);
        setPost(response.dữ_liệu);
      } else {
        toast.error(response.tin_nhan || "Không thể tải bài đăng");
      }
    } catch (error) {
      console.error("Lỗi tải bài đăng:", error);
      toast.error("Không thể tải bài đăng");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (isLoadMore = false, pageNum = null) => {
    try {
      const currentPage = pageNum !== null ? pageNum : page;
      console.log(
        "🔍 Fetching comments - Page:",
        currentPage,
        "isLoadMore:",
        isLoadMore
      );
      const response = await commentAPI.getComments(id, currentPage, 10);
      if (response.thành_công) {
        console.log("✅ Fetched comments:", response.dữ_liệu.length);
        if (isLoadMore) {
          // Thêm vào list hiện tại
          setComments((prev) => [...prev, ...response.dữ_liệu]);
        } else {
          // Replace toàn bộ - tạo array mới để force re-render
          setComments([...response.dữ_liệu]);
        }
      }
    } catch (error) {
      console.error("Lỗi tải bình luận:", error);
    }
  };

  const handleCommentSubmit = async () => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("⚠️ Vui lòng đăng nhập để bình luận");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    if (!commentContent.trim()) {
      toast.warn("Vui lòng nhập nội dung bình luận");
      return;
    }

    // Validate rating (1-5)
    let validRating = null;
    if (rating && rating >= 1 && rating <= 5) {
      validRating = rating;
    }

    try {
      setCommentLoading(true);
      const response = await commentAPI.createComment(
        id,
        commentContent,
        validRating
      );
      if (response.thành_công) {
        setCommentContent("");
        setRating(0);
        toast.success(response.tin_nhan || "Bình luận thành công");
        setPage(1);
        fetchComments();
        // Fetch lại post để cập nhật commentCount
        fetchPostDetail();
      } else {
        toast.error(response.tin_nhan || "Không thể gửi bình luận");
      }
    } catch (error) {
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi gửi bình luận");
    } finally {
      setCommentLoading(false);
    }
  };

  // Hàm refresh comments
  const handleRefreshComments = async () => {
    console.log("🔄 Refreshing comments...");
    // Đợi một chút để DB lưu xong
    await new Promise((resolve) => setTimeout(resolve, 300));
    setPage(1);
    await fetchComments(false, 1);
    // Fetch lại post để cập nhật commentCount
    await fetchPostDetail();
    console.log("✅ Refresh complete!");
  };

  // Xử lý reply comment
  const handleReplyComment = async (
    parentCommentId,
    content,
    rootCommentId = null
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("⚠️ Vui lòng đăng nhập để trả lời");
      navigate("/login");
      return;
    }

    try {
      const response = await commentAPI.createComment(
        id,
        content,
        null,
        parentCommentId
      );
      if (response.thành_công) {
        return response.dữ_liệu;
      }
    } catch (error) {
      throw error;
    }
  };

  // Xử lý xóa comment
  const handleDeleteComment = async (commentId, parentCommentId) => {
    try {
      const response = await commentAPI.deleteComment(commentId);
      if (response.thành_công) {
        return true;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleContactSeller = () => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("⚠️ Vui lòng đăng nhập để liên hệ người bán");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    const seller = post?.sellerId || post?.seller;
    if (!seller) {
      toast.warn("Không tìm thấy thông tin người bán");
      return;
    }

    // Lấy sellerId (có thể là string hoặc object)
    let sellerId;
    if (typeof seller === "string") {
      sellerId = seller;
    } else if (seller && seller._id) {
      sellerId = seller._id;
    } else {
      toast.error("Thông tin người bán không hợp lệ");
      return;
    }

    console.log("Navigating to chat with:", { sellerId, postId: post._id });
    navigate(`/chat?sellerId=${sellerId}&postId=${post._id}`);
  };

  const handleReport = () => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("⚠️ Vui lòng đăng nhập để báo cáo vi phạm");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    setReportType("post");
    setSelectedCommentId(null);
    setSelectedCommentAuthor(null);
    setShowReportModal(true);
  };

  const handleReportComment = (commentId, authorId, authorName) => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("⚠️ Vui lòng đăng nhập để báo cáo bình luận");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    setReportType("comment");
    setSelectedCommentId(commentId);
    setSelectedCommentAuthor({ id: authorId, name: authorName });
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    console.log("=== Bắt đầu gửi báo cáo ===");
    console.log("reportData:", reportData);
    console.log("reportType:", reportType);
    console.log("selectedCommentId:", selectedCommentId);
    console.log("selectedCommentAuthor:", selectedCommentAuthor);

    // Kiểm tra lý do báo cáo
    if (!reportData.reason) {
      console.log("Lỗi: Chưa chọn lý do báo cáo");
      toast.error("⚠️ Vui lòng chọn lý do báo cáo từ danh sách");
      return;
    }

    if (reportData.reason.trim() === "") {
      console.log("Lỗi: Lý do báo cáo rỗng");
      toast.error("⚠️ Lý do báo cáo không hợp lệ");
      return;
    }

    // Kiểm tra nếu chọn "Khác" thì bắt buộc phải nhập mô tả
    if (reportData.reason === "khac" && !reportData.description.trim()) {
      console.log("Lỗi: Chọn lý do 'Khác' nhưng chưa nhập mô tả");
      toast.error("⚠️ Vui lòng mô tả chi tiết lý do báo cáo");
      return;
    }

    try {
      let payload = {
        reason: reportData.reason.trim(),
        description: reportData.description?.trim() || "",
      };

      if (reportType === "post") {
        // Báo cáo bài đăng
        const seller = post?.sellerId || post?.seller;
        let reportedUserId;

        if (typeof seller === "string") {
          reportedUserId = seller;
        } else if (seller && seller._id) {
          reportedUserId = seller._id;
        } else {
          toast.error("Không tìm thấy thông tin người bán");
          console.error("Seller data invalid:", seller);
          console.error("Post data:", post);
          return;
        }

        if (!reportedUserId) {
          toast.error("Không thể xác định người bán");
          return;
        }

        payload.postId = id;
        payload.reportedUserId = reportedUserId;
        payload.reportType = "post";
      } else if (reportType === "comment") {
        // Báo cáo bình luận
        if (!selectedCommentId || !selectedCommentAuthor) {
          toast.error("Không tìm thấy thông tin bình luận");
          return;
        }

        if (!selectedCommentAuthor.id) {
          toast.error("Không thể xác định tác giả bình luận");
          return;
        }

        payload.commentId = selectedCommentId;
        payload.reportedUserId = selectedCommentAuthor.id;
        payload.reportType = "comment";
      }

      console.log("Payload cuối cùng:", payload);
      console.log("Gửi request đến API...");

      const response = await reportAPI.createReport(payload);

      console.log("Response từ API:", response);

      if (response.thành_công) {
        toast.success("✅ Báo cáo đã được gửi. Admin sẽ xem xét!");
        setShowReportModal(false);
        setReportData({ reason: "", description: "" });
        setReportType("post");
        setSelectedCommentId(null);
        setSelectedCommentAuthor(null);
      } else {
        console.log("Lỗi từ server:", response.tin_nhan);
        toast.error("❌ " + (response.tin_nhan || "Không thể gửi báo cáo"));
      }
    } catch (error) {
      console.error("=== Lỗi khi gửi báo cáo ===");
      console.error("Error object:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.tin_nhan ||
        error.message ||
        "Lỗi khi gửi báo cáo";
      toast.error("❌ " + errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Không tìm thấy bài đăng</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md group"
      >
        <svg
          className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="font-medium text-gray-700 group-hover:text-gray-900">
          Quay lại
        </span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images */}
        <div className="lg:col-span-2">
          {post.images && post.images.length > 0 ? (
            <div className="space-y-4">
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className="w-full bg-gray-100 rounded-lg shadow-lg overflow-hidden flex items-center justify-center"
                  style={{ minHeight: "400px", maxHeight: "600px" }}
                >
                  <img
                    src={resolveUrl(image)}
                    alt={`${post.title} - Hình ${index + 1}`}
                    className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition"
                    style={{ maxHeight: "600px" }}
                    onClick={() => window.open(image, "_blank")}
                    onError={(e) => {
                      console.error("Image load error:", image);
                      e.target.src =
                        "https://via.placeholder.com/800x600?text=Không+thể+tải+ảnh";
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-96 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-3">📷</div>
              <span className="text-gray-500 text-lg font-medium">
                Chưa có hình ảnh
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>

          {post.postType === "ban" && (
            <div className="text-3xl font-bold text-blue-600 mb-6">
              {post.price?.toLocaleString("vi-VN")} đ
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="mb-4 pb-4 border-b">
              <h3 className="font-bold mb-2">Thông tin bài đăng</h3>
              <p className="text-gray-600 mb-2">
                <strong>Danh mục:</strong> {post.category}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Tình trạng:</strong> {post.condition}
              </p>
              <p className="text-gray-600">
                <strong>Địa điểm:</strong> {post.location}
              </p>
            </div>

            <h3 className="font-bold mb-4">Người bán</h3>
            <div className="flex items-center gap-4">
              {post.sellerId?.avatar || post.seller?.avatar ? (
                <img
                  src={resolveUrl(post.sellerId?.avatar || post.seller?.avatar)}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover bg-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/48?text=" +
                      (post.sellerId?.fullName || post.seller?.fullName || "?")
                        .charAt(0)
                        .toUpperCase();
                  }}
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                  {(post.sellerId?.fullName || post.seller?.fullName || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold">
                  {post.sellerId?.fullName ||
                    post.seller?.fullName ||
                    "Người dùng"}
                </p>
                <p className="text-sm text-gray-600">
                  ⭐ {post.sellerId?.rating || post.seller?.rating || 5}(
                  {post.sellerId?.totalRatings ||
                    post.seller?.totalRatings ||
                    0}{" "}
                  đánh giá)
                </p>
              </div>
            </div>

            <button
              onClick={handleContactSeller}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 mt-6"
            >
              Liên hệ người bán
            </button>

            <div className="mt-4 flex gap-2">
              <div className="flex-1">
                <SaveButton postId={id} isSaved={post.isSaved} />
              </div>
              <button
                onClick={handleReport}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition border border-red-300"
                title="Báo cáo vi phạm"
              >
                🚩 Báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Mô tả chi tiết</h2>
        <p className="text-gray-700 leading-relaxed">{post.description}</p>
      </div>

      {/* Comments Section */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">
          Bình luận ({post.commentCount})
        </h2>

        {localStorage.getItem("token") ? (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="4"
            />

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Đánh giá:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(rating === star ? 0 : star)}
                      className={`text-xl ${
                        rating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleCommentSubmit}
                disabled={commentLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {commentLoading ? "Đang gửi..." : "Gửi bình luận"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 text-center">
            <div className="text-5xl mb-3">💬</div>
            <p className="text-gray-700 text-lg font-medium mb-3">
              Bạn cần đăng nhập để bình luận và đánh giá
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🔐 Đăng nhập ngay
            </button>
          </div>
        )}

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={getCurrentUserId()}
                onReply={handleReplyComment}
                onReport={(commentId, commenter) =>
                  handleReportComment(
                    commentId,
                    commenter._id,
                    commenter.fullName
                  )
                }
                onDelete={handleDeleteComment}
                onRefresh={handleRefreshComments}
                rootCommentId={comment._id}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              Chưa có bình luận nào
            </p>
          )}
        </div>

        {comments.length > 0 && comments.length >= page * 10 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                // Đợi state update rồi fetch
                setTimeout(() => fetchComments(true), 100);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem thêm bình luận
            </button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🚩 Báo cáo vi phạm
            </h3>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                {reportType === "post" ? (
                  <>
                    <strong>Đối tượng:</strong> Bài đăng "{post?.title}"
                  </>
                ) : (
                  <>
                    <strong>Đối tượng:</strong> Bình luận của{" "}
                    {selectedCommentAuthor?.name}
                  </>
                )}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lý do báo cáo <span className="text-red-500">*</span>
              </label>
              <select
                value={reportData.reason}
                onChange={(e) =>
                  setReportData({ ...reportData, reason: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value="">-- Chọn lý do --</option>
                <option value="spam">🚫 Spam</option>
                <option value="noi_dung_khong_phu_hop">
                  ⚠️ Nội dung không phù hợp
                </option>
                <option value="lua_dao">💰 Lừa đảo</option>
                <option value="thong_tin_sai_lech">
                  📢 Thông tin sai lệch
                </option>
                <option value="ngon_tu_tho_tuc">🤬 Ngôn từ thô tục</option>
                <option value="quay_roi">😠 Quấy rối</option>
                <option value="khac">📝 Khác (vui lòng mô tả)</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả chi tiết{" "}
                {reportData.reason === "khac" ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-gray-400 text-xs">(Tùy chọn)</span>
                )}
              </label>
              <textarea
                value={reportData.description}
                onChange={(e) =>
                  setReportData({ ...reportData, description: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 resize-none"
                rows="4"
                placeholder={
                  reportData.reason === "khac"
                    ? "Vui lòng mô tả chi tiết lý do báo cáo..."
                    : "Mô tả chi tiết về vi phạm (không bắt buộc)..."
                }
                required={reportData.reason === "khac"}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReportSubmit}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Gửi báo cáo
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportData({ reason: "", description: "" });
                  setReportType("post");
                  setSelectedCommentId(null);
                  setSelectedCommentAuthor(null);
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
