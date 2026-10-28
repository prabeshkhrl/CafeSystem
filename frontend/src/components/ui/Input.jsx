export default function Input({ className = "", error, ...props }) {
  return (
    <input
      className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm outline-none transition placeholder:text-gray-400 ${
        error
          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
          : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      } ${className}`}
      {...props}
    />
  );
}