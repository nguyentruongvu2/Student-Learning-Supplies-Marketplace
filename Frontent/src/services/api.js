import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    console.log("🚀 Axios Request Interceptor:");
    console.log("   Method:", config.method?.toUpperCase());
    console.log("   BaseURL:", config.baseURL);
    console.log("   URL:", config.url);
    console.log("   Full URL:", `${config.baseURL}${config.url}`);
    console.log("   Data:", config.data);

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Response Interceptor:");
    console.log("   Status:", response.status);
    console.log("   Data:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ Response Interceptor Error:");
    console.error("   Status:", error.response?.status);
    console.error("   Data:", error.response?.data);
    console.error("   Message:", error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
