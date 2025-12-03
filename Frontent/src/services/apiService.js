import api from "./api";

// ==================== AUTH API ====================

export const authAPI = {
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (email, password) => {
    console.log("📡 apiService.login called");
    console.log("📧 Email:", email);
    console.log("🔑 Password length:", password?.length);
    console.log("🔗 Endpoint: /auth/login");

    const response = await api.post("/auth/login", { email, password });
    console.log("📥 Response status:", response.status);
    console.log("📦 Response data:", response.data);

    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post(`/auth/verify-email/${token}`);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};

// ==================== USER API ====================

export const userAPI = {
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUserProfile: async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  getAllUsers: async (page = 1, limit = 10, role = null, search = null) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (role) params.append("role", role);
    if (search) params.append("search", search);

    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },

  lockUnlockUser: async (userId, isActive, lockReason = null) => {
    const response = await api.put(`/users/${userId}/lock`, {
      isActive,
      lockReason,
    });
    return response.data;
  },

  getUserWarnings: async (userId) => {
    const response = await api.get(`/users/${userId}/warnings`);
    return response.data;
  },

  markWarningAsRead: async (userId, warningId) => {
    const response = await api.put(
      `/users/${userId}/warnings/${warningId}/read`
    );
    return response.data;
  },
};

// ==================== POST API ====================

export const postAPI = {
  getAllPosts: async (
    page = 1,
    limit = 10,
    category = null,
    postType = null,
    search = null,
    sort = null,
    priceMin = null,
    priceMax = null,
    dateFilter = null,
    conditions = null,
    negotiableOnly = false
  ) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (category) params.append("category", category);
    if (postType) params.append("postType", postType);
    if (search) params.append("search", search);
    if (sort) params.append("sort", sort);
    if (priceMin !== null) params.append("priceMin", priceMin);
    if (priceMax !== null) params.append("priceMax", priceMax);
    if (dateFilter) params.append("dateFilter", dateFilter);
    if (conditions) params.append("conditions", conditions);
    if (negotiableOnly) params.append("negotiableOnly", "true");

    const response = await api.get(`/posts?${params.toString()}`);
    return response.data;
  },

  getPostDetail: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  createPost: async (data) => {
    const response = await api.post("/posts", data);
    return response.data;
  },

  updatePost: async (postId, data) => {
    const response = await api.put(`/posts/${postId}`, data);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  savePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/save`);
    return response.data;
  },

  getSavedPosts: async (page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    const response = await api.get(`/posts/saved?${params.toString()}`);
    return response.data;
  },

  approvePost: async (postId) => {
    const response = await api.put(`/posts/${postId}/approve`);
    return response.data;
  },

  rejectPost: async (postId, reason = null) => {
    const response = await api.put(`/posts/${postId}/reject`, { reason });
    return response.data;
  },

  getUserPosts: async (page = 1, limit = 10, status = null) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (status) params.append("status", status);

    const response = await api.get(`/posts/user/my-posts?${params.toString()}`);
    return response.data;
  },

  getPendingPosts: async (page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    params.append("status", "cho_duyet");

    const response = await api.get(`/posts?${params.toString()}`);
    return response.data;
  },
};

// ==================== COMMENT API ====================

export const commentAPI = {
  getComments: async (postId, page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);

    const response = await api.get(`/comments/${postId}?${params.toString()}`);
    return response.data;
  },

  createComment: async (
    postId,
    content,
    rating = null,
    parentCommentId = null
  ) => {
    const response = await api.post("/comments", {
      postId,
      content,
      rating,
      parentCommentId,
    });
    return response.data;
  },

  updateComment: async (commentId, content, rating = null) => {
    const response = await api.put(`/comments/${commentId}`, {
      content,
      rating,
    });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  likeComment: async (commentId) => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data;
  },

  reactToComment: async (commentId, reactionType) => {
    const response = await api.post(`/comments/${commentId}/react`, {
      reactionType,
    });
    return response.data;
  },
};

// ==================== REPORT API ====================

export const reportAPI = {
  getReports: async (status = null, page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (status) params.append("status", status);

    const response = await api.get(`/reports?${params.toString()}`);
    return response.data;
  },

  getReportDetail: async (reportId) => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },

  createReport: async (reportData) => {
    const response = await api.post("/reports", reportData);
    return response.data;
  },

  updateReport: async (reportId, data) => {
    const response = await api.put(`/reports/${reportId}`, data);
    return response.data;
  },

  handleReport: async (reportId, action, adminResponse = null) => {
    const response = await api.put(`/reports/${reportId}`, {
      status: "da_xu_ly",
      action,
      adminResponse,
    });
    return response.data;
  },
};

// ==================== MESSAGE API ====================

export const messageAPI = {
  getConversations: async (page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);

    const response = await api.get(
      `/messages/conversations?${params.toString()}`
    );
    return response.data;
  },

  createConversation: async (participantId, relatedPostId = null) => {
    const response = await api.post("/messages/conversations/create", {
      participantId,
      relatedPostId,
    });
    return response.data;
  },

  deleteConversation: async (conversationId) => {
    const response = await api.delete(
      `/messages/conversations/${conversationId}`
    );
    return response.data;
  },

  getMessages: async (conversationId, page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);

    const response = await api.get(
      `/messages/${conversationId}?${params.toString()}`
    );
    return response.data;
  },

  sendMessage: async (conversationId, content, images = []) => {
    const response = await api.post("/messages", {
      conversationId,
      content,
      images,
    });
    return response.data;
  },

  markMessageAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  },

  recallMessage: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/recall`);
    return response.data;
  },
};
