import React, { useState } from "react";
import {
  FiFolder,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiStar,
  FiShuffle,
  FiTag,
  FiCheckSquare,
} from "react-icons/fi";

const FilterButton = ({ icon: Icon, title }) => (
  <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between font-semibold text-gray-800 rounded">
    <span className="flex items-center gap-3">
      <Icon className="text-xl text-gray-600" />
      <span className="text-sm">{title}</span>
    </span>
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 448 512"
      className="text-gray-500"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
    </svg>
  </button>
);

const FilterPanel = ({ onChange }) => {
  const [negotiable, setNegotiable] = useState(false);

  const toggleNegotiable = () => {
    const next = !negotiable;
    setNegotiable(next);
    onChange?.({ negotiable: next });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Bộ lọc
        </h3>
        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition">
          ✖
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <FilterButton icon={FiFolder} title="Danh mục" />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <FilterButton icon={FiBriefcase} title="Loại bài đăng" />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <FilterButton icon={FiDollarSign} title="Khoảng giá" />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <FilterButton icon={FiCalendar} title="Thời gian đăng" />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <FilterButton icon={FiStar} title="Tình trạng" />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <FilterButton icon={FiShuffle} title="Sắp xếp theo" />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
          <input
            type="checkbox"
            checked={negotiable}
            onChange={toggleNegotiable}
            className="w-5 h-5 text-rose-600 focus:ring-rose-500 rounded"
          />
          <span className="text-lg">🤝</span>
          <span className="flex-1 font-semibold text-gray-800">
            Chỉ giá có thể thương lượng
          </span>
        </label>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
        <p className="text-sm text-gray-700">
          <strong className="text-blue-600">💡 Mẹo:</strong> Kết hợp nhiều bộ
          lọc để tìm đúng những gì bạn cần!
        </p>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 font-semibold">
          Xóa
        </button>
        <button className="flex-1 px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700">
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
