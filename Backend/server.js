const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const http = require("http");
const socketIO = require("socket.io");

// Tải biến môi trường
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Serve uploaded files when running locally (uploads/)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Kết nối Cơ sở dữ liệu
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/nha-cho-sinh-vien",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✓ MongoDB kết nối thành công"))
  .catch((err) => console.error("✗ Lỗi kết nối MongoDB:", err));

// Kết nối Socket.io cho chat real-time
io.on("connection", (socket) => {
  console.log("Người dùng mới kết nối:", socket.id);

  // Người dùng online
  socket.on("user_online", async (userId) => {
    try {
      const User = require("./models/User");
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date(),
      });
      socket.userId = userId;
      io.emit("user_status_changed", { userId, isOnline: true });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái online:", error);
    }
  });

  // Tham gia vào phòng (phòng cuộc trò chuyện)
  socket.on("join_room", (data) => {
    socket.join(data.room);
    console.log(`Người dùng ${socket.id} tham gia phòng ${data.room}`);
  });

  // Xử lý tin nhắn đến
  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  // Ngắt kết nối
  socket.on("disconnect", async () => {
    console.log("Người dùng ngắt kết nối:", socket.id);
    if (socket.userId) {
      try {
        const User = require("./models/User");
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          lastSeen: new Date(),
        });
        io.emit("user_status_changed", {
          userId: socket.userId,
          isOnline: false,
        });
      } catch (error) {
        console.error("Lỗi cập nhật trạng thái offline:", error);
      }
    }
  });
});

// Các tuyến đường API
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/admin/stats", require("./routes/statsRoutes"));
app.use("/api/admin/audit-logs", require("./routes/auditLogRoutes"));
// Upload routes
app.use("/api/upload", require("./routes/uploadRoutes"));

// Kiểm tra sức khỏe server
app.get("/api/health", (req, res) => {
  res.json({ trang_thai: "Máy chủ đang chạy" });
});

// Xử lý lỗi Middleware
app.use((err, req, res, next) => {
  console.error("Lỗi:", err);
  res.status(err.status || 500).json({
    tin_nhan: err.message || "Lỗi máy chủ nội bộ",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Khởi động máy chủ
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Máy chủ chạy trên cổng ${PORT}`);
});

module.exports = { app, io };
