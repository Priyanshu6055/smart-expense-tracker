import { Filter, Calendar, Search, RotateCcw } from "lucide-react";

export default function FiltersBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  searchTerm,
  setSearchTerm,
  onReset,
}) {
  return (
    <div className="
      bg-gray-800
      p-3 md:p-6
      rounded-lg md:rounded-xl
      shadow-xl
      border border-gray-700
      mb-6 md:mb-10
      grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4
      gap-3 md:gap-4
    ">
      {/* Category */}
      <div>
        <label className="block text-gray-300 text-[11px] md:text-sm mb-1">
          <Filter size={14} className="inline mr-1" /> Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-2 py-1.5 text-xs md:text-sm bg-gray-700 rounded border border-gray-600"
        >
          <option value="">All Categories</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Start Date */}
      <div className="overflow-hidden">
        <label className="block text-gray-300 text-[11px] md:text-sm mb-1">
          <Calendar size={14} className="inline mr-1" /> Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full min-w-0 px-1 py-1 text-[11px] md:text-sm bg-gray-700 rounded border border-gray-600"
        />
      </div>

      {/* End Date */}
      <div className="overflow-hidden">
        <label className="block text-gray-300 text-[11px] md:text-sm mb-1">
          <Calendar size={14} className="inline mr-1" /> End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full min-w-0 px-1 py-1 text-[11px] md:text-sm bg-gray-700 rounded border border-gray-600"
        />
      </div>

      {/* Search */}
      <div>
        <label className="block text-gray-300 text-[11px] md:text-sm mb-1">
          <Search size={14} className="inline mr-1" /> Search
        </label>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1.5 text-xs md:text-sm bg-gray-700 rounded border border-gray-600"
        />
      </div>

      {/* Reset Button */}
      <div className="col-span-2 lg:col-span-4">
        <button
          type="button"
          onClick={onReset}
          className="w-full mt-2 bg-gray-600 hover:bg-gray-500 py-2 rounded text-xs md:text-sm flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} /> Reset Filters
        </button>
      </div>
    </div>
  );
}
