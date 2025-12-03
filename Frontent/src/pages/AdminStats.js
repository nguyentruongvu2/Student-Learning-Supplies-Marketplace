import React from "react";
import DashboardStats from "../components/DashboardStats";

const AdminStats = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          📊 Thống kê
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Theo dõi hoạt động của hệ thống
        </p>
      </div>
      <DashboardStats />
    </div>
  );
};

export default AdminStats;
