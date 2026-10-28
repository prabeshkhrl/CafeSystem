import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ error, className = "", ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className={`w-full px-4 pr-11 py-2.5 rounded-xl border bg-white text-sm outline-none transition placeholder:text-gray-400 ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        } ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}