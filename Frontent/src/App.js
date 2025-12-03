import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Trang
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PostDetail from "./pages/PostDetail";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminStats from "./pages/AdminStats";
import AdminPosts from "./pages/AdminPosts";
import AdminReports from "./pages/AdminReports";
import AdminUsers from "./pages/AdminUsers";
import Chat from "./pages/Chat";
import MyPosts from "./pages/MyPosts";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";
import SavedPosts from "./pages/SavedPosts";

// Các thành phần
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import PrivateRoute from "./components/PrivateRoute";

// Socket
import { initializeSocket, disconnectSocket } from "./services/socketService";

// Styles
import "./index.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to update user from localStorage
  const updateUserFromStorage = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Khởi tạo Socket.io khi có token
      initializeSocket(token);
    }

    setLoading(false);

    // Listen for storage changes
    window.addEventListener("storage", updateUserFromStorage);

    // Cleanup khi unmount
    return () => {
      window.removeEventListener("storage", updateUserFromStorage);
      if (!token) {
        disconnectSocket();
      }
    };
  }, []);

  // Update when user changes
  useEffect(() => {
    if (user) {
      console.log("User updated:", user.role);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Hiển thị Navbar cho tất cả trang trừ login/register */}
        <Navbar
          user={user}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
        />

        <main className="flex-grow">
          <Routes>
            {/* Tuyến Công khai */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <div className="absolute inset-0 z-[200]">
                  <Login
                    setIsAuthenticated={setIsAuthenticated}
                    setUser={setUser}
                  />
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div className="absolute inset-0 z-[200]">
                  <Register />
                </div>
              }
            />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/posts/:id" element={<PostDetail />} />

            {/* Tuyến Riêng tư */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-posts"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <MyPosts />
                </PrivateRoute>
              }
            />
            <Route
              path="/saved-posts"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <SavedPosts />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <CreatePost />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-post/:id"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <EditPost />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Profile user={user} />
                </PrivateRoute>
              }
            />

            {/* Tuyến Quản trị - Redirect từ /admin sang /admin/stats */}
            <Route
              path="/admin"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requireAdmin={true}
                >
                  <Navigate to="/admin/stats" replace />
                </PrivateRoute>
              }
            />

            {/* Admin Layout với sidebar */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requireAdmin={true}
                >
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route path="stats" element={<AdminStats />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {!(user?.role === "admin") && <Footer />}
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
