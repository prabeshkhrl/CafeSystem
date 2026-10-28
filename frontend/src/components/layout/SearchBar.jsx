import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `/restaurants?search=${encodeURIComponent(q)}` : "/restaurants");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden lg:flex items-center bg-gray-50 rounded-full px-3 py-2 w-64 border border-gray-100 focus-within:border-orange-300 focus-within:bg-white transition"
    >
      <Search className="w-4 h-4 text-gray-400 shrink-0" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search restaurants..."
        className="bg-transparent outline-none text-sm ml-2 w-full placeholder:text-gray-400"
      />
    </form>
  );
}