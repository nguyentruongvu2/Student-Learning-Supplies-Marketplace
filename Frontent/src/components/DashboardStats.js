import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Đăng ký Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DashboardStats = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7"); // 7, 14, 30 days
  const [overview, setOverview] = useState(null);
  const [dailyStats, setDailyStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [reportReasons, setReportReasons] = useState(null);

  useEffect(() => {
    fetchAllStats();
  }, [timeRange]);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      console.log("🔍 Token:", token ? "✓ Có" : "✗ Không có");
      console.log("🔍 API URL:", API_URL);

      if (!token) {
        toast.error("Vui lòng đăng nhập lại");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Fetch overview
      console.log("📊 Đang tải overview...");
      const overviewRes = await axios.get(
        `${API_URL}/admin/stats/overview`,
        config
      );
      console.log("✓ Overview:", overviewRes.data);
      setOverview(overviewRes.data.dữ_liệu);

      // Fetch daily stats
      console.log("📊 Đang tải daily stats...");
      const dailyRes = await axios.get(
        `${API_URL}/admin/stats/daily?days=${timeRange}`,
        config
      );
      console.log("✓ Daily stats:", dailyRes.data);
      setDailyStats(dailyRes.data.dữ_liệu);

      // Fetch category stats
      console.log("📊 Đang tải category stats...");
      const categoryRes = await axios.get(
        `${API_URL}/admin/stats/post-categories`,
        config
      );
      console.log("✓ Category stats:", categoryRes.data);
      setCategoryStats(categoryRes.data.dữ_liệu);

      // Fetch report reasons
      console.log("📊 Đang tải report reasons...");
      const reportRes = await axios.get(
        `${API_URL}/admin/stats/report-reasons`,
        config
      );
      console.log("✓ Report reasons:", reportRes.data);
      setReportReasons(reportRes.data.dữ_liệu);

      console.log("✅ Tải thống kê thành công!");
    } catch (error) {
      console.error("❌ Lỗi tải thống kê:", error);
      console.error("❌ Response:", error.response?.data);
      console.error("❌ Status:", error.response?.status);
      toast.error(error.response?.data?.tin_nhan || "Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">
          ❌ Không thể tải dữ liệu thống kê
        </p>
        <button
          onClick={fetchAllStats}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          🔄 Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards - Số liệu tổng quan */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          📊 Thống kê tổng quan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tổng người dùng */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">👥</div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-semibold">Tổng</span>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">
              {overview.total.users}
            </div>
            <div className="text-blue-100 text-sm">Người dùng</div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm">
                <span>🆕 Hôm nay:</span>
                <span className="font-bold">+{overview.today.users}</span>
              </div>
            </div>
          </div>

          {/* Tổng bài đăng */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">📝</div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-semibold">Tổng</span>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">
              {overview.total.posts}
            </div>
            <div className="text-green-100 text-sm">Bài đăng</div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm">
                <span>🆕 Hôm nay:</span>
                <span className="font-bold">+{overview.today.posts}</span>
              </div>
            </div>
          </div>

          {/* Tổng báo cáo */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">⚠️</div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-semibold">Tổng</span>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">
              {overview.total.reports}
            </div>
            <div className="text-orange-100 text-sm">Báo cáo</div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm">
                <span>🆕 Hôm nay:</span>
                <span className="font-bold">+{overview.today.reports}</span>
              </div>
            </div>
          </div>

          {/* Báo cáo chờ xử lý */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">🔔</div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-semibold">Cần xử lý</span>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">
              {overview.total.pendingReports}
            </div>
            <div className="text-red-100 text-sm">Chờ xử lý</div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm">
                <span>⏱️ Cần xem xét</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê theo thời gian */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📈 Thống kê {timeRange} ngày gần đây
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange("7")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                timeRange === "7"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              7 ngày
            </button>
            <button
              onClick={() => setTimeRange("14")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                timeRange === "14"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              14 ngày
            </button>
            <button
              onClick={() => setTimeRange("30")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                timeRange === "30"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              30 ngày
            </button>
          </div>
        </div>

        {/* Bảng thống kê chi tiết theo ngày */}
        {dailyStats && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                    📅 Ngày
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">
                    👥 Người dùng mới
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">
                    📝 Bài đăng mới
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">
                    💬 Bình luận
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">
                    ⚠️ Báo cáo
                  </th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.users?.map((item, index) => {
                  const postItem = dailyStats.posts?.[index];
                  const commentItem = dailyStats.comments?.[index];
                  const reportItem = dailyStats.reports?.[index];

                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {new Date(item.date).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          <span>👤</span>
                          <span>{item.count}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          <span>📄</span>
                          <span>{postItem?.count || 0}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                          <span>💭</span>
                          <span>{commentItem?.count || 0}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                          <span>🚨</span>
                          <span>{reportItem?.count || 0}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    📊 TỔNG CỘNG
                  </td>
                  <td className="px-6 py-4 text-center text-blue-700">
                    {dailyStats.users?.reduce(
                      (sum, item) => sum + item.count,
                      0
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-green-700">
                    {dailyStats.posts?.reduce(
                      (sum, item) => sum + item.count,
                      0
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-purple-700">
                    {dailyStats.comments?.reduce(
                      (sum, item) => sum + item.count,
                      0
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-orange-700">
                    {dailyStats.reports?.reduce(
                      (sum, item) => sum + item.count,
                      0
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Biểu đồ thống kê */}
      {dailyStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biểu đồ Line - Người dùng & Bài đăng */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📈 Người dùng & Bài đăng theo ngày
            </h3>
            <div style={{ height: "300px" }}>
              <Line
                data={{
                  labels: dailyStats.users?.map((item) => {
                    const date = new Date(item.date);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }),
                  datasets: [
                    {
                      label: "Người dùng",
                      data: dailyStats.users?.map((item) => item.count),
                      borderColor: "rgb(59, 130, 246)",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      fill: true,
                      tension: 0.4,
                    },
                    {
                      label: "Bài đăng",
                      data: dailyStats.posts?.map((item) => item.count),
                      borderColor: "rgb(16, 185, 129)",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        font: {
                          size: 13,
                          weight: "bold",
                        },
                        padding: 15,
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(0,0,0,0.8)",
                      padding: 12,
                      titleFont: { size: 14, weight: "bold" },
                      bodyFont: { size: 13 },
                      callbacks: {
                        label: function (context) {
                          return (
                            context.dataset.label +
                            ": " +
                            context.parsed.y +
                            " " +
                            (context.dataset.label === "Người dùng"
                              ? "người"
                              : "bài")
                          );
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "📅 Ngày trong tháng",
                        font: {
                          size: 14,
                          weight: "bold",
                        },
                        color: "#374151",
                      },
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "📊 Số lượng",
                        font: {
                          size: 14,
                          weight: "bold",
                        },
                        color: "#374151",
                      },
                      ticks: {
                        precision: 0,
                        font: {
                          size: 12,
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Biểu đồ Bar - Báo cáo & Bình luận */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📊 Báo cáo & Bình luận theo ngày
            </h3>
            <div style={{ height: "300px" }}>
              <Bar
                data={{
                  labels: dailyStats.reports?.map((item) => {
                    const date = new Date(item.date);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }),
                  datasets: [
                    {
                      label: "Báo cáo",
                      data: dailyStats.reports?.map((item) => item.count),
                      backgroundColor: "rgba(239, 68, 68, 0.8)",
                    },
                    {
                      label: "Bình luận",
                      data: dailyStats.comments?.map((item) => item.count),
                      backgroundColor: "rgba(251, 146, 60, 0.8)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        font: {
                          size: 13,
                          weight: "bold",
                        },
                        padding: 15,
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(0,0,0,0.8)",
                      padding: 12,
                      titleFont: { size: 14, weight: "bold" },
                      bodyFont: { size: 13 },
                      callbacks: {
                        label: function (context) {
                          return (
                            context.dataset.label +
                            ": " +
                            context.parsed.y +
                            " " +
                            (context.dataset.label === "Báo cáo"
                              ? "báo cáo"
                              : "bình luận")
                          );
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "📅 Ngày trong tháng",
                        font: {
                          size: 14,
                          weight: "bold",
                        },
                        color: "#374151",
                      },
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "📈 Số lượng",
                        font: {
                          size: 14,
                          weight: "bold",
                        },
                        color: "#374151",
                      },
                      ticks: {
                        precision: 0,
                        font: {
                          size: 12,
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Biểu đồ Doughnut - Danh mục bài đăng */}
          {categoryStats && categoryStats.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🍩 Phân bố danh mục
              </h3>
              <div style={{ height: "300px" }}>
                <Doughnut
                  data={{
                    labels: categoryStats.map(
                      (item) => item.category || "Khác"
                    ),
                    datasets: [
                      {
                        label: "Số lượng",
                        data: categoryStats.map((item) => item.count),
                        backgroundColor: [
                          "rgba(59, 130, 246, 0.8)",
                          "rgba(16, 185, 129, 0.8)",
                          "rgba(251, 146, 60, 0.8)",
                          "rgba(139, 92, 246, 0.8)",
                          "rgba(236, 72, 153, 0.8)",
                          "rgba(14, 165, 233, 0.8)",
                        ],
                        borderWidth: 2,
                        borderColor: "#fff",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          font: {
                            size: 13,
                            weight: "bold",
                          },
                          padding: 15,
                          generateLabels: function (chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                              const dataset = data.datasets[0];
                              const total = dataset.data.reduce(
                                (a, b) => a + b,
                                0
                              );
                              return data.labels.map((label, i) => {
                                const value = dataset.data[i];
                                const percentage = (
                                  (value / total) *
                                  100
                                ).toFixed(1);
                                return {
                                  text: `${label}: ${value} (${percentage}%)`,
                                  fillStyle: dataset.backgroundColor[i],
                                  hidden: false,
                                  index: i,
                                };
                              });
                            }
                            return [];
                          },
                        },
                      },
                      tooltip: {
                        backgroundColor: "rgba(0,0,0,0.8)",
                        padding: 12,
                        titleFont: { size: 14, weight: "bold" },
                        bodyFont: { size: 13 },
                        callbacks: {
                          label: function (context) {
                            const label = context.label || "";
                            const value = context.parsed;
                            const total = context.dataset.data.reduce(
                              (a, b) => a + b,
                              0
                            );
                            const percentage = ((value / total) * 100).toFixed(
                              1
                            );
                            return `${label}: ${value} bài (${percentage}%)`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Biểu đồ Doughnut - Lý do báo cáo */}
          {reportReasons && reportReasons.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🍩 Phân bố lý do báo cáo
              </h3>
              <div style={{ height: "300px" }}>
                <Doughnut
                  data={{
                    labels: reportReasons.map((item) => {
                      const reasonMap = {
                        spam: "Spam",
                        noi_dung_khong_phu_hop: "Nội dung không phù hợp",
                        lua_dao: "Lừa đảo",
                        thong_tin_sai_lech: "Thông tin sai",
                        ngon_tu_tho_tuc: "Ngôn từ thô tục",
                        quay_roi: "Quấy rối",
                        khac: "Khác",
                      };
                      return reasonMap[item.reason] || item.reason;
                    }),
                    datasets: [
                      {
                        label: "Số lượng",
                        data: reportReasons.map((item) => item.count),
                        backgroundColor: [
                          "rgba(239, 68, 68, 0.8)",
                          "rgba(251, 146, 60, 0.8)",
                          "rgba(234, 179, 8, 0.8)",
                          "rgba(139, 92, 246, 0.8)",
                          "rgba(236, 72, 153, 0.8)",
                          "rgba(100, 116, 139, 0.8)",
                        ],
                        borderWidth: 2,
                        borderColor: "#fff",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          font: {
                            size: 13,
                            weight: "bold",
                          },
                          padding: 15,
                          generateLabels: function (chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                              const dataset = data.datasets[0];
                              const total = dataset.data.reduce(
                                (a, b) => a + b,
                                0
                              );
                              return data.labels.map((label, i) => {
                                const value = dataset.data[i];
                                const percentage = (
                                  (value / total) *
                                  100
                                ).toFixed(1);
                                return {
                                  text: `${label}: ${value} (${percentage}%)`,
                                  fillStyle: dataset.backgroundColor[i],
                                  hidden: false,
                                  index: i,
                                };
                              });
                            }
                            return [];
                          },
                        },
                      },
                      tooltip: {
                        backgroundColor: "rgba(0,0,0,0.8)",
                        padding: 12,
                        titleFont: { size: 14, weight: "bold" },
                        bodyFont: { size: 13 },
                        callbacks: {
                          label: function (context) {
                            const label = context.label || "";
                            const value = context.parsed;
                            const total = context.dataset.data.reduce(
                              (a, b) => a + b,
                              0
                            );
                            const percentage = ((value / total) * 100).toFixed(
                              1
                            );
                            return `${label}: ${value} báo cáo (${percentage}%)`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Thống kê theo danh mục */}
      {categoryStats && categoryStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📁 Thống kê theo danh mục
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.map((cat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-5 border-2 border-indigo-100 hover:border-indigo-300 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">
                    {cat.category === "Sách"
                      ? "📚"
                      : cat.category === "Bút & Giấy"
                      ? "✏️"
                      : cat.category === "Đồ điện tử"
                      ? "💻"
                      : cat.category === "Đồ dùng học tập"
                      ? "📝"
                      : cat.category === "Quần áo"
                      ? "👕"
                      : "📦"}
                  </div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {cat.count}
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {cat.category}
                </div>
                <div className="mt-2 text-xs text-gray-500">bài đăng</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thống kê lý do báo cáo */}
      {reportReasons && reportReasons.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🚨 Thống kê lý do báo cáo
          </h2>
          <div className="space-y-3">
            {reportReasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    {(() => {
                      const reasonMap = {
                        spam: "Spam",
                        noi_dung_khong_phu_hop: "Nội dung không phù hợp",
                        lua_dao: "Lừa đảo",
                        thong_tin_sai_lech: "Thông tin sai lệch",
                        ngon_tu_tho_tuc: "Ngôn từ thô tục",
                        quay_roi: "Quấy rối",
                        khac: "Khác",
                      };
                      return reasonMap[reason.reason] || reason.reason;
                    })()}
                  </div>
                  <div className="text-sm text-gray-500">Số lượng báo cáo</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-600">
                    {reason.count}
                  </div>
                </div>
                <div className="w-32">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (reason.count /
                            Math.max(...reportReasons.map((r) => r.count))) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;
