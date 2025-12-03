import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { messageAPI } from "../services/apiService";
import { FaPaperPlane, FaUser, FaSearch } from "react-icons/fa";
import {
  getSocket,
  onReceiveMessage,
  onTyping,
  onStopTyping,
  notifyTyping,
  notifyStopTyping,
  notifyUserOnline,
  onUserStatusChanged,
  onMessageRecalled,
  removeMessageListener,
  removeTypingListener,
} from "../services/socketService";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Notify user is online when component mounts
  useEffect(() => {
    const socket = getSocket();
    if (socket && currentUser?._id) {
      notifyUserOnline(currentUser._id);

      // Listen for user status changes
      onUserStatusChanged((data) => {
        console.log("User status changed:", data);
        // Update conversations list to reflect online status
        setConversations((prev) =>
          prev.map((conv) => {
            const updatedParticipants = conv.participants.map((p) => {
              if (p._id === data.userId) {
                return { ...p, isOnline: data.isOnline };
              }
              return p;
            });
            return { ...conv, participants: updatedParticipants };
          })
        );

        // Update selected conversation if needed
        if (selectedConversation) {
          const otherUser = getOtherParticipant(selectedConversation);
          if (otherUser?._id === data.userId) {
            setSelectedConversation((prev) => ({
              ...prev,
              participants: prev.participants.map((p) =>
                p._id === data.userId ? { ...p, isOnline: data.isOnline } : p
              ),
            }));
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const initChat = async () => {
      await fetchConversations();

      // If coming from post detail with sellerId, create or find conversation
      const sellerId = searchParams.get("sellerId");
      const postId = searchParams.get("postId");
      if (sellerId && postId) {
        await createOrFindConversation(sellerId, postId);
      }
    };

    initChat();
  }, [searchParams]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Chỉ scroll khi có tin nhắn mới
    if (messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      console.log("Fetching conversations...");
      const response = await messageAPI.getConversations(1, 50);
      console.log("Conversations response:", response);
      if (response.thành_công) {
        console.log("Conversations data:", response.dữ_liệu);
        const convs = response.dữ_liệu || [];
        setConversations(convs);
        if (convs.length > 0 && !selectedConversation) {
          setSelectedConversation(convs[0]);
        }
        return convs; // Return để createOrFindConversation dùng
      } else {
        console.error("Failed to fetch conversations:", response.tin_nhan);
        return [];
      }
    } catch (error) {
      console.error("Lỗi tải cuộc trò chuyện:", error);
      console.error("Error details:", error.response?.data);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await messageAPI.getMessages(conversationId, 1, 50);
      if (response.thành_công) {
        setMessages(response.dữ_liệu);
      }
    } catch (error) {
      console.error("Lỗi tải tin nhắn:", error);
    }
  };

  const createOrFindConversation = async (sellerId, postId) => {
    try {
      console.log("Creating/Finding conversation:", { sellerId, postId });

      // Lấy conversations hiện tại
      const currentConvs =
        conversations.length > 0 ? conversations : await fetchConversations();

      console.log("Current conversations:", currentConvs);

      // Find if conversation already exists
      const existing = currentConvs.find((conv) => {
        const hasSellerParticipant = conv.participants?.some((p) => {
          const pId = typeof p === "string" ? p : p._id;
          return pId === sellerId;
        });
        const hasSamePost =
          conv.postId?._id === postId || conv.relatedPost?._id === postId;
        return hasSellerParticipant && hasSamePost;
      });

      if (existing) {
        console.log("Found existing conversation:", existing);
        setSelectedConversation(existing);
        return;
      }

      // Create new conversation
      console.log("Creating new conversation...");
      const response = await messageAPI.createConversation(sellerId, postId);
      console.log("Create conversation response:", response);

      if (response.thành_công) {
        const newConv = response.dữ_liệu;
        setConversations([newConv, ...currentConvs]);
        setSelectedConversation(newConv);
        toast.success("Đã tạo cuộc trò chuyện");
      } else {
        toast.error(response.tin_nhan || "Không thể tạo cuộc trò chuyện");
      }
    } catch (error) {
      console.error("Lỗi tạo cuộc trò chuyện:", error);
      console.error("Error details:", error.response?.data);
      toast.error(
        error.response?.data?.tin_nhan || "Lỗi khi tạo cuộc trò chuyện"
      );
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) {
      toast.warn("Vui lòng nhập tin nhắn");
      return;
    }

    try {
      setSending(true);
      notifyStopTyping(selectedConversation._id);

      const response = await messageAPI.sendMessage(
        selectedConversation._id,
        messageText
      );
      if (response.thành_công) {
        setMessages([...messages, response.dữ_liệu]);
        setMessageText("");
      }
    } catch (error) {
      toast.error(error.response?.data?.tin_nhan || "Lỗi khi gửi tin nhắn");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!window.confirm("Bạn có chắc muốn xóa cuộc trò chuyện này?")) {
      return;
    }

    try {
      const response = await messageAPI.deleteConversation(conversationId);
      if (response.thành_công) {
        toast.success("Đã xóa cuộc trò chuyện");
        setConversations(conversations.filter((c) => c._id !== conversationId));
        if (selectedConversation?._id === conversationId) {
          setSelectedConversation(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Lỗi xóa cuộc trò chuyện:", error);
      toast.error(
        error.response?.data?.tin_nhan || "Lỗi khi xóa cuộc trò chuyện"
      );
    }
  };

  // Socket.io listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedConversation) return;

    // Nhận tin nhắn mới
    onReceiveMessage((data) => {
      if (data.conversationId === selectedConversation._id) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    // Người dùng đang gõ
    onTyping((data) => {
      if (data.conversationId === selectedConversation._id) {
        setTypingUsers((prev) => {
          if (!prev.includes(data.userId)) {
            return [...prev, data.userId];
          }
          return prev;
        });
      }
    });

    // Người dùng dừng gõ
    onStopTyping((data) => {
      if (data.conversationId === selectedConversation._id) {
        setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
      }
    });

    // Tin nhắn bị thu hồi
    onMessageRecalled((data) => {
      if (data.conversationId === selectedConversation._id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId
              ? {
                  ...msg,
                  isRecalled: true,
                  recalledAt: data.message.recalledAt,
                  content: "Tin nhắn đã được thu hồi",
                  images: [],
                }
              : msg
          )
        );
      }
    });

    return () => {
      removeMessageListener();
      removeTypingListener();
    };
  }, [selectedConversation]);

  // Gửi typing indicator
  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    if (selectedConversation) {
      notifyTyping(selectedConversation._id);

      // Reset timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        notifyStopTyping(selectedConversation._id);
      }, 1000);
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants) return null;
    return conversation.participants.find((p) => p._id !== currentUser?._id);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {conversations.length === 0 ? (
        <div className="max-w-7xl mx-auto w-full px-4 py-12 flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              💬 Tin nhắn
            </h1>
            <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-800 font-bold mb-2">
                Bạn chưa có cuộc trò chuyện nào
              </p>
              <p className="text-gray-600">
                Liên hệ người bán từ trang bài đăng để bắt đầu trò chuyện
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col min-h-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">💬 Tin nhắn</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
            {/* Conversations List */}
            <div className="bg-white rounded-2xl shadow-lg p-4 overflow-y-auto border-2 border-gray-100">
              <div className="mb-4 flex items-center gap-2">
                <h2 className="font-bold text-xl text-gray-800 flex-1">
                  Cuộc trò chuyện
                </h2>
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {conversations.length}
                </span>
              </div>
              <div className="space-y-2">
                {conversations.map((conv) => {
                  const otherUser = getOtherParticipant(conv);
                  const isSelected = selectedConversation?._id === conv._id;
                  return (
                    <div
                      key={conv._id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-600 shadow-lg scale-105"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                            isSelected
                              ? "bg-blue-400"
                              : "bg-gradient-to-br from-blue-400 to-indigo-600"
                          }`}
                        >
                          {otherUser?.fullName?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">
                            {otherUser?.fullName || "Ẩn danh"}
                          </p>
                          <p
                            className={`text-sm truncate ${
                              isSelected ? "text-blue-100" : "text-gray-600"
                            }`}
                          >
                            {conv.lastMessage || "Chưa có tin nhắn"}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conv._id);
                          }}
                          className={`p-2 rounded-lg transition ${
                            isSelected
                              ? "hover:bg-blue-400 text-white"
                              : "hover:bg-red-100 text-red-600"
                          }`}
                          title="Xóa cuộc trò chuyện"
                        >
                          🗑️
                        </button>
                      </div>
                      {(conv.postId || conv.relatedPost) && (
                        <p
                          className={`text-xs mt-2 px-2 py-1 rounded-lg ${
                            isSelected
                              ? "bg-blue-400 text-blue-50"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          📖 {(conv.postId || conv.relatedPost)?.title}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Window */}
            {selectedConversation && (
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg flex flex-col h-[calc(100vh-8rem)] border-2 border-gray-100">
                {/* Header - Cố định */}
                <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-5 border-b-4 border-blue-700">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center font-bold text-lg">
                        {getOtherParticipant(
                          selectedConversation
                        )?.fullName?.charAt(0) || "?"}
                      </div>
                      {/* Online status indicator */}
                      {getOtherParticipant(selectedConversation)?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">
                        {getOtherParticipant(selectedConversation)?.fullName ||
                          "Ẩn danh"}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-blue-100">
                        {getOtherParticipant(selectedConversation)?.isOnline ? (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Đang hoạt động
                          </span>
                        ) : (
                          getOtherParticipant(selectedConversation)
                            ?.lastSeen && (
                            <span>
                              Hoạt động{" "}
                              {new Date(
                                getOtherParticipant(
                                  selectedConversation
                                ).lastSeen
                              ).toLocaleString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )
                        )}
                      </div>
                      {(selectedConversation.postId ||
                        selectedConversation.relatedPost) && (
                        <p className="text-sm text-blue-100 mt-1">
                          📖{" "}
                          {
                            (
                              selectedConversation.postId ||
                              selectedConversation.relatedPost
                            )?.title
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages - Scroll ở đây */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-5xl mb-3">👋</div>
                      <p className="text-lg font-bold">
                        Bắt đầu cuộc trò chuyện
                      </p>
                      <p className="text-sm">Gửi tin nhắn đầu tiên của bạn</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isOwn = msg.senderId._id === currentUser?._id;
                      const msgDate = new Date(msg.createdAt);
                      const prevMsg = index > 0 ? messages[index - 1] : null;
                      const prevDate = prevMsg
                        ? new Date(prevMsg.createdAt)
                        : null;
                      const showDateSeparator =
                        !prevDate ||
                        msgDate.toDateString() !== prevDate.toDateString();

                      return (
                        <React.Fragment key={msg._id}>
                          {showDateSeparator && (
                            <div className="flex justify-center my-4">
                              <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                {msgDate.toLocaleDateString("vi-VN", {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                          )}
                          <div
                            className={`flex ${
                              isOwn ? "justify-end" : "justify-start"
                            } group`}
                          >
                            <div
                              className={`max-w-xs px-5 py-3 rounded-2xl shadow-md relative ${
                                msg.isRecalled
                                  ? "bg-gray-100 text-gray-500 italic border-2 border-gray-300"
                                  : isOwn
                                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none"
                                  : "bg-white text-gray-800 border-2 border-gray-200 rounded-bl-none"
                              }`}
                            >
                              <p className="text-base break-words">
                                {msg.content}
                              </p>
                              <div
                                className={`flex items-center gap-2 text-xs mt-2 ${
                                  msg.isRecalled
                                    ? "text-gray-400"
                                    : isOwn
                                    ? "text-blue-100"
                                    : "text-gray-500"
                                }`}
                              >
                                <span>
                                  {msgDate.toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {isOwn && msg.isRead && !msg.isRecalled && (
                                  <span className="text-blue-200">✓✓</span>
                                )}
                              </div>

                              {/* Nút thu hồi tin nhắn */}
                              {isOwn && !msg.isRecalled && (
                                <button
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        "Bạn có chắc muốn thu hồi tin nhắn này?"
                                      )
                                    ) {
                                      try {
                                        const response =
                                          await messageAPI.recallMessage(
                                            msg._id
                                          );
                                        toast.success("Đã thu hồi tin nhắn");

                                        // Cập nhật local state ngay lập tức
                                        setMessages((prev) =>
                                          prev.map((m) =>
                                            m._id === msg._id
                                              ? {
                                                  ...m,
                                                  isRecalled: true,
                                                  recalledAt: Date.now(),
                                                  content:
                                                    "Tin nhắn đã được thu hồi",
                                                  images: [],
                                                }
                                              : m
                                          )
                                        );
                                      } catch (error) {
                                        toast.error(
                                          error.response?.data?.tin_nhan ||
                                            "Không thể thu hồi tin nhắn"
                                        );
                                      }
                                    }
                                  }}
                                  className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                                  title="Thu hồi tin nhắn (trong 15 phút)"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })
                  )}
                  {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 p-4 text-sm text-gray-600 bg-white rounded-xl border-2 border-gray-200 w-fit">
                      <span className="font-medium">✍️ Đang gõ</span>
                      <span className="flex gap-1">
                        <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce delay-200"></span>
                      </span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-5 border-t-4 border-gray-200 bg-white flex-shrink-0 flex gap-3 items-end">
                  <textarea
                    value={messageText}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none text-base min-h-[44px] max-h-[200px]"
                    rows="1"
                    style={{
                      height: "auto",
                      overflowY:
                        messageText.split("\n").length > 5 ? "auto" : "hidden",
                    }}
                    onInput={(e) => {
                      e.target.style.height = "44px";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !messageText.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:scale-100 font-bold flex items-center gap-2"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
