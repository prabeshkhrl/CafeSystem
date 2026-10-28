import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  size = "sm",
  showValue = true,
  count,
}) {
  const sizeClass = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  return (
    <div className="flex items-center gap-1">
      <Star className={`${sizeClass} fill-yellow-400 text-yellow-400`} />
      <span className={`font-semibold text-gray-900 text-${size === "lg" ? "base" : "sm"}`}>
        {Number(value).toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
}