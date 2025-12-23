const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Return base origin (without trailing /api)
const getApiOrigin = () => {
  try {
    return API_URL.replace(/\/api\/?$/, "");
  } catch (e) {
    return "http://localhost:5000";
  }
};

export const resolveUrl = (url) => {
  if (!url) return url;
  // blob URLs should be returned as-is
  if (url.startsWith("blob:")) return url;
  // Already absolute
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // If backend-relative uploads path
  if (url.startsWith("/uploads")) {
    return `${getApiOrigin()}${url}`;
  }
  // If api path like /api/uploads
  if (url.startsWith("/api/uploads")) {
    return `${getApiOrigin()}${url.replace(/^\/api/, "")}`;
  }
  return url;
};

export default resolveUrl;
