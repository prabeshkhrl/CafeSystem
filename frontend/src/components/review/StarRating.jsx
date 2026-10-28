import { Star } from "lucide-react";
import { useState } from "react";

const sizeMap = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-6 h-6" };

export default function StarRating({
  value = 0,
  onChange,           // presence makes it interactive
  size = "md",
  count,
  showValue = false,
}) {
  const [hover, setHover] = useState(0);
  const readOnly = !onChange;

  const display = readOnly ? value : hover || value;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="inline-flex items-center">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= Math.round(display);
          return (
            <button
              key={n}
              type="button"
              disabled={readOnly}
              onClick={() => onChange?.(n)}
              onMouseEnter={() => !readOnly && setHover(n)}
              onMouseLeave={() => !readOnly && setHover(0)}
              className={`p-0.5 transition ${
                readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
              }`}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              <Star
                className={`${sizeMap[size]} ${
                  filled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-transparent text-gray-300"
                }`}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="font-semibold text-gray-900 text-sm ml-1">
          {Number(display).toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
}