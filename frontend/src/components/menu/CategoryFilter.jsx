export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Pill active={selected === "all"} onClick={() => onSelect("all")}>
        All
      </Pill>
      {categories.map((cat) => (
        <Pill key={cat} active={selected === cat} onClick={() => onSelect(cat)}>
          {cat}
        </Pill>
      ))}
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition shrink-0 ${
        active
          ? "bg-orange-500 text-white shadow-md"
          : "bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
      }`}
    >
      {children}
    </button>
  );
}