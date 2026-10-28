import { Link } from "react-router-dom";

const categories = [
  { label: "Pizza", emoji: "🍕" },
  { label: "Burgers", emoji: "🍔" },
  { label: "Rice", emoji: "🍚" },
  { label: "Curry", emoji: "🍛" },
  { label: "Sides", emoji: "🍟" },
  { label: "Desserts", emoji: "🍰" },
  { label: "Beverages", emoji: "🥤" },
  { label: "Salads", emoji: "🥗" },
];

export default function CategoryChips() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            What are you craving?
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Pick a category to explore.
          </p>
        </div>
        <Link
          to="/restaurants"
          className="text-sm font-medium text-orange-500 hover:text-orange-600"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.label}
            to={`/restaurants?category=${cat.label}`}
            className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-md transition"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              {cat.emoji}
            </div>
            <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-600 transition text-center">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}