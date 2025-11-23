import io from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✓ Kết nối Socket.io thành công");
  });

  socket.on("disconnect", () => {
    console.log("✗ Ngắt kết nối Socket.io");
  });

  socket.on("error", (error) => {
    console.error("Lỗi Socket.io:", error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};

// ==================== SOCKET EVENTS ====================

export const socketEvents = {
  // Tin nhắn
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
  MESSAGE_DELIVERED: "message_delivered",

  // Typing indicator
  USER_TYPING: "user_typing",
  USER_STOP_TYPING: "user_stop_typing",

  // Online status
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",
  UPDATE_ONLINE_STATUS: "update_online_status",

  // Conversation
  CONVERSATION_UPDATED: "conversation_updated",
  MESSAGE_READ: "message_read",

  // Notifications
  NOTIFICATION: "notification",
};

// ==================== HELPER FUNCTIONS ====================

export const sendMessage = (conversationId, content, images = []) => {
  if (socket) {
    socket.emit(socketEvents.SEND_MESSAGE, {
      conversationId,
      content,
      images,
    });
  }
};

export const markMessageAsRead = (conversationId, messageId) => {
  if (socket) {
    socket.emit(socketEvents.MESSAGE_READ, {
      conversationId,
      messageId,
    });
  }
};

export const notifyTyping = (conversationId) => {
  if (socket) {
    socket.emit(socketEvents.USER_TYPING, {
      conversationId,
    });
  }
};

export const notifyStopTyping = (conversationId) => {
  if (socket) {
    socket.emit(socketEvents.USER_STOP_TYPING, {
      conversationId,
    });
  }
};

export const notifyUserOnline = (userId) => {
  if (socket) {
    socket.emit("user_online", userId);
  }
};

export const updateOnlineStatus = (isOnline) => {
  if (socket) {
    socket.emit(socketEvents.UPDATE_ONLINE_STATUS, {
      isOnline,
    });
  }
};

// ==================== EVENT LISTENERS ====================

export const onReceiveMessage = (callback) => {
  if (socket) {
    socket.on(socketEvents.RECEIVE_MESSAGE, callback);
  }
};

export const onTyping = (callback) => {
  if (socket) {
    socket.on(socketEvents.USER_TYPING, callback);
  }
};

export const onStopTyping = (callback) => {
  if (socket) {
    socket.on(socketEvents.USER_STOP_TYPING, callback);
  }
};

export const onUserOnline = (callback) => {
  if (socket) {
    socket.on(socketEvents.USER_ONLINE, callback);
  }
};

export const onUserOffline = (callback) => {
  if (socket) {
    socket.on(socketEvents.USER_OFFLINE, callback);
  }
};

export const onUserStatusChanged = (callback) => {
  if (socket) {
    socket.on("user_status_changed", callback);
  }
};

export const onNotification = (callback) => {
  if (socket) {
    socket.on(socketEvents.NOTIFICATION, callback);
  }
};

export const removeMessageListener = () => {
  if (socket) {
    socket.off(socketEvents.RECEIVE_MESSAGE);
  }
};

export const removeTypingListener = () => {
  if (socket) {
    socket.off(socketEvents.USER_TYPING);
    socket.off(socketEvents.USER_STOP_TYPING);
  }
};

export const removeOnlineListener = () => {
  if (socket) {
    socket.off(socketEvents.USER_ONLINE);
    socket.off(socketEvents.USER_OFFLINE);
  }
};

export const removeNotificationListener = () => {
  if (socket) {
    socket.off(socketEvents.NOTIFICATION);
  }
};
