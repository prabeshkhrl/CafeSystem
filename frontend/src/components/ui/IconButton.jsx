export default function IconButton({
  className = "",
  children,
  badge,
  ...props
}) {
  return (
    <button
      className={`relative p-2.5 rounded-full hover:bg-orange-50 transition group ${className}`}
      {...props}
    >
      {children}
      {badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}