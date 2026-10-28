import { Search, X } from "lucide-react";

export default function RestaurantFilters({ value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-orange-300 focus-within:bg-white transition">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          placeholder="Search restaurants by name or location..."
          className="bg-transparent outline-none text-sm ml-2 w-full placeholder:text-gray-400"
        />
        {value.search && (
          <button
            onClick={() => onChange({ ...value, search: "" })}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <button
        onClick={() =>
          onChange({ ...value, isActive: value.isActive ? undefined : true })
        }
        className={`px-5 py-3 rounded-xl text-sm font-medium transition border ${
          value.isActive
            ? "bg-orange-50 border-orange-200 text-orange-600"
            : "bg-white border-gray-200 text-gray-600 hover:border-orange-200"
        }`}
      >
        Open now
      </button>
    </div>
  );
}