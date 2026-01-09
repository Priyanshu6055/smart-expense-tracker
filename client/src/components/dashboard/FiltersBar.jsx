import { Filter, Calendar, Search } from "lucide-react";

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
}) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 mb-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Category Filter */}
      <div>
        <label
          htmlFor="category-filter"
          className="block text-gray-300 font-medium text-sm mb-1"
        >
          <Filter size={16} className="inline mr-1" /> Filter by Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Start Date */}
      <div>
        <label
          htmlFor="start-date"
          className="block text-gray-300 font-medium text-sm mb-1"
        >
          <Calendar size={16} className="inline mr-1" /> Start Date
        </label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* End Date */}
      <div>
        <label
          htmlFor="end-date"
          className="block text-gray-300 font-medium text-sm mb-1"
        >
          <Calendar size={16} className="inline mr-1" /> End Date
        </label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Search */}
      <div>
        <label
          htmlFor="search-term"
          className="block text-gray-300 font-medium text-sm mb-1"
        >
          <Search size={16} className="inline mr-1" /> Search
        </label>
        <input
          type="text"
          id="search-term"
          placeholder="Search by description or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
    </div>
  );
}
