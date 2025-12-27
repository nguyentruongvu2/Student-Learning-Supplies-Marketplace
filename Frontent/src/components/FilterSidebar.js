import React, { useState } from "react";
import { FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

const FilterSidebar = ({
  isOpen,
  onClose,
  category,
  setCategory,
  postType,
  setPostType,
  priceRange,
  setPriceRange,
  dateFilter,
  setDateFilter,
  conditions,
  setConditions,
  sortBy,
  setSortBy,
  onClearFilters,
}) => {
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [typeExpanded, setTypeExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [dateExpanded, setDateExpanded] = useState(true);
  const [conditionExpanded, setConditionExpanded] = useState(true);
  const [sortExpanded, setSortExpanded] = useState(true);

  const categories = [
    { value: "", label: "Tất cả danh mục", icon: "📂" },
    { value: "Sách", label: "Sách", icon: "📚" },
    { value: "Bút & Giấy", label: "Bút & Giấy", icon: "✏️" },
    { value: "Đồ điện tử", label: "Đồ điện tử", icon: "💻" },
    { value: "Đồ dùng học tập", label: "Đồ dùng học tập", icon: "📝" },
    { value: "Quần áo", label: "Quần áo", icon: "👕" },
    { value: "Khác", label: "Khác", icon: "📦" },
  ];

  const postTypes = [
    { value: "", label: "Tất cả loại", icon: "🔄" },
    { value: "ban", label: "Bán", icon: "💰" },
    { value: "trao_doi", label: "Trao đổi", icon: "🔄" },
  ];

  const priceRanges = [
    { value: "all", label: "Tất cả giá", min: null, max: null },
    { value: "under50", label: "Dưới 50.000đ", min: 0, max: 50000 },
    { value: "50to100", label: "50.000đ - 100.000đ", min: 50000, max: 100000 },
    {
      value: "100to200",
      label: "100.000đ - 200.000đ",
      min: 100000,
      max: 200000,
    },
    {
      value: "200to500",
      label: "200.000đ - 500.000đ",
      min: 200000,
      max: 500000,
    },
    { value: "over500", label: "Trên 500.000đ", min: 500000, max: null },
  ];

  const dateFilters = [
    { value: "", label: "Tất cả thời gian", icon: "📅" },
    { value: "today", label: "Hôm nay", icon: "🌟" },
    { value: "week", label: "Tuần này", icon: "📆" },
    { value: "month", label: "Tháng này", icon: "🗓️" },
  ];

  const conditionOptions = [
    { value: "Mới", label: "Mới", icon: "✨" },
    { value: "Như mới", label: "Như mới", icon: "🌟" },
    { value: "Tốt", label: "Tốt", icon: "👍" },
    { value: "Bình thường", label: "Bình thường", icon: "👌" },
    { value: "Cần sửa chữa", label: "Cần sửa chữa", icon: "🔧" },
  ];

  const sortOptions = [
    { value: "newest", label: "Mới nhất", icon: "🆕" },
    { value: "oldest", label: "Cũ nhất", icon: "⏳" },
    { value: "price_asc", label: "Giá thấp → cao", icon: "💵" },
    { value: "price_desc", label: "Giá cao → thấp", icon: "💰" },
    { value: "most_viewed", label: "Xem nhiều nhất", icon: "👀" },
    { value: "most_saved", label: "Lưu nhiều nhất", icon: "❤️" },
  ];

  const handleConditionToggle = (value) => {
    if (conditions.includes(value)) {
      setConditions(conditions.filter((c) => c !== value));
    } else {
      setConditions([...conditions, value]);
    }
  };

  const hasActiveFilters = () => {
    return (
      category ||
      postType ||
      priceRange !== "all" ||
      dateFilter ||
      conditions.length > 0 ||
      sortBy !== "newest"
    );
  };

  return (
    <>
      {/* Overlay - Only on mobile when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 lg:top-16 left-0 h-screen lg:h-[calc(100vh-4rem)] w-72 bg-white shadow-xl z-50 lg:z-10 border-r border-gray-200
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto flex-shrink-0
        `}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">🎯</span>
              Bộ lọc
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters() && (
            <button
              onClick={onClearFilters}
              className="w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold text-sm flex items-center justify-center gap-2"
            >
              <span>✕</span> Xóa tất cả bộ lọc
            </button>
          )}

          {/* Category Filter */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setCategoryExpanded(!categoryExpanded)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between font-bold text-gray-800"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">📁</span>
                DANH MỤC
              </span>
              {categoryExpanded ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>
            {categoryExpanded && (
              <div className="p-3 space-y-1 bg-white">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                      flex items-center gap-3 font-medium
                      ${
                        category === cat.value
                          ? "bg-blue-600 text-white shadow-lg scale-105"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102"
                      }
                    `}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="flex-1">{cat.label}</span>
                    {category === cat.value && (
                      <span className="text-sm">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Post Type Filter */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setTypeExpanded(!typeExpanded)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between font-bold text-gray-800"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">💼</span>
                LOẠI BÀI ĐĂNG
              </span>
              {typeExpanded ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>
            {typeExpanded && (
              <div className="p-3 space-y-1 bg-white">
                {postTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setPostType(type.value)}
                    className={`
                    w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                    flex items-center gap-3 font-medium
                    ${
                      postType === type.value
                        ? "bg-green-600 text-white shadow-lg scale-105"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102"
                    }
                  `}
                  >
                    <span className="text-xl">{type.icon}</span>
                    <span className="flex-1">{type.label}</span>
                    {postType === type.value && (
                      <span className="text-sm">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setPriceExpanded(!priceExpanded)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between font-bold text-gray-800"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">💵</span>
                KHOẢNG GIÁ
              </span>
              {priceExpanded ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>
            {priceExpanded && (
              <div className="p-3 space-y-2 bg-white">
                {priceRanges.map((range) => (
                  <label
                    key={range.value}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                      ${
                        priceRange === range.value
                          ? "bg-emerald-50 border-2 border-emerald-500"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === range.value}
                      onChange={() => setPriceRange(range.value)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span
                      className={`flex-1 font-medium ${
                        priceRange === range.value
                          ? "text-emerald-700"
                          : "text-gray-700"
                      }`}
                    >
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Date Filter */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setDateExpanded(!dateExpanded)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between font-bold text-gray-800"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                THỜI GIAN ĐĂNG
              </span>
              {dateExpanded ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>
            {dateExpanded && (
              <div className="p-3 space-y-1 bg-white">
                {dateFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setDateFilter(filter.value)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                      flex items-center gap-3 font-medium
                      ${
                        dateFilter === filter.value
                          ? "bg-purple-600 text-white shadow-lg scale-105"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102"
                      }
                    `}
                  >
                    <span className="text-xl">{filter.icon}</span>
                    <span className="flex-1">{filter.label}</span>
                    {dateFilter === filter.value && (
                      <span className="text-sm">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Condition Filter */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setConditionExpanded(!conditionExpanded)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between font-bold text-gray-800"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                TÌNH TRẠNG
              </span>
              {conditionExpanded ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>
            {conditionExpanded && (
              <div className="p-3 space-y-2 bg-white">
                {conditionOptions.map((cond) => (
                  <label
                    key={cond.value}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                      ${
                        conditions.includes(cond.value)
                          ? "bg-amber-50 border-2 border-amber-500"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={conditions.includes(cond.value)}
                      onChange={() => handleConditionToggle(cond.value)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
                    />
                    <span className="text-lg">{cond.icon}</span>
                    <span
                      className={`flex-1 font-medium ${
                        conditions.includes(cond.value)
                          ? "text-amber-700"
                          : "text-gray-700"
                      }`}
                    >
                      {cond.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sort Options */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setSortExpanded(!sortExpanded)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between font-bold text-gray-800"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🔢</span>
                SẮP XẾP THEO
              </span>
              {sortExpanded ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>
            {sortExpanded && (
              <div className="p-3 space-y-1 bg-white">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                      flex items-center gap-3 font-medium
                      ${
                        sortBy === option.value
                          ? "bg-indigo-600 text-white shadow-lg scale-105"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102"
                      }
                    `}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span className="flex-1">{option.label}</span>
                    {sortBy === option.value && (
                      <span className="text-sm">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters() && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-700 mb-3 text-sm">
                BỘ LỌC ĐANG DÙNG:
              </h3>
              <div className="space-y-2">
                {category && (
                  <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                    <span className="text-sm text-blue-800">📁 {category}</span>
                    <button
                      onClick={() => setCategory("")}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {postType && (
                  <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
                    <span className="text-sm text-green-800">
                      💼 {postType === "ban" ? "Bán" : "Trao đổi"}
                    </span>
                    <button
                      onClick={() => setPostType("")}
                      className="text-green-600 hover:text-green-800"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {priceRange !== "all" && (
                  <div className="flex items-center justify-between bg-emerald-50 p-2 rounded-lg">
                    <span className="text-sm text-emerald-800">
                      💵{" "}
                      {priceRanges.find((r) => r.value === priceRange)?.label}
                    </span>
                    <button
                      onClick={() => setPriceRange("all")}
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {dateFilter && (
                  <div className="flex items-center justify-between bg-purple-50 p-2 rounded-lg">
                    <span className="text-sm text-purple-800">
                      📅{" "}
                      {dateFilters.find((d) => d.value === dateFilter)?.label}
                    </span>
                    <button
                      onClick={() => setDateFilter("")}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {conditions.length > 0 && (
                  <div className="flex items-center justify-between bg-amber-50 p-2 rounded-lg">
                    <span className="text-sm text-amber-800">
                      ⭐ {conditions.length} tình trạng
                    </span>
                    <button
                      onClick={() => setConditions([])}
                      className="text-amber-600 hover:text-amber-800"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {sortBy !== "newest" && (
                  <div className="flex items-center justify-between bg-indigo-50 p-2 rounded-lg">
                    <span className="text-sm text-indigo-800">
                      🔢 {sortOptions.find((s) => s.value === sortBy)?.label}
                    </span>
                    <button
                      onClick={() => setSortBy("newest")}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-gray-700">
              <strong className="text-blue-600">💡 Mẹo:</strong> Kết hợp nhiều
              bộ lọc để tìm đúng những gì bạn cần!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
