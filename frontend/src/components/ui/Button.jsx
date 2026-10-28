import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md hover:shadow-lg",
  secondary:
    "bg-white border border-gray-200 text-gray-800 hover:border-orange-300 hover:text-orange-600",
  ghost: "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

const sizes = {
  sm: "text-xs px-3 py-1.5 rounded-full",
  md: "text-sm px-4 py-2 rounded-full",
  lg: "text-base px-6 py-3 rounded-full",
};

export default function Button({
  as = "button",
  to,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const cls = `inline-flex items-center justify-center gap-2 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

  if (as === "link" || to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}