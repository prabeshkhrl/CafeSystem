import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home, 
  ArrowLeft, 
  Compass, 
  Search, 
  Sparkles, 
  RotateCcw
} from "lucide-react";
import Button from "../ui/Button"; // Or your custom button component
import useAuthStore from "../../store/useAuthStore";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [searchQuery, setSearchQuery] = useState("");

  // Game state for the mini "Snack Catcher" distraction
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [score, setScore] = useState(0);
  const [snackPos, setSnackPos] = useState({ x: 50, y: 10 });
  const [currentSnack, setCurrentSnack] = useState("🍕");

  const snacks = ["🍕", "🍔", "🍩", "🌮", "🥗", "🍟", "🍣", "🍦"];

  // Quick categories for lost foodies
  const quickCategories = [
    { name: "Pizza", icon: "🍕", link: "/restaurants?category=pizza" },
    { name: "Burgers", icon: "🍔", link: "/restaurants?category=burgers" },
    { name: "Asian", icon: "🍜", link: "/restaurants?category=asian" },
    { name: "Desserts", icon: "🍰", link: "/restaurants?category=desserts" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const spawnNewSnack = () => {
    const randomSnack = snacks[Math.floor(Math.random() * snacks.length)];
    const randomX = Math.floor(Math.random() * 80) + 10; // 10% to 90%
    setCurrentSnack(randomSnack);
    setSnackPos({ x: randomX, y: Math.floor(Math.random() * 40) + 20 });
  };

  const catchSnack = () => {
    setScore((prev) => prev + 1);
    spawnNewSnack();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-gray-50/30">
      {/* Background Decorative Animated Floating Blobs */}
      <div className="absolute top-1/4 left-10 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl animate-pulse delay-700 -z-10" />

      <div className="max-w-xl w-full text-center relative">

        {/* --- MAIN HERO ANIMATION AREA --- */}
        <div className="relative mb-6 inline-block select-none">
          {/* Outer glowing ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 blur-xl opacity-30 animate-pulse" />

          {/* Main Floating Circle Container */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full bg-gradient-to-br from-amber-100 via-orange-100 to-amber-50 shadow-inner flex items-center justify-center border-4 border-white animate-bounce-slow">
            
            {/* Animated Steam lines */}
            <div className="absolute -top-6 flex gap-2 opacity-60">
              <span className="w-1.5 h-6 bg-gradient-to-t from-orange-300 to-transparent rounded-full animate-steam" />
              <span className="w-1.5 h-8 bg-gradient-to-t from-orange-400 to-transparent rounded-full animate-steam delay-150" />
              <span className="w-1.5 h-5 bg-gradient-to-t from-orange-300 to-transparent rounded-full animate-steam delay-300" />
            </div>

            {/* Central Main Emoji / Game Catch Object */}
            {!isPlayingGame ? (
              <span className="text-7xl sm:text-8xl transform hover:scale-110 transition-transform duration-300 cursor-pointer drop-shadow-md">
                🍲
              </span>
            ) : (
              <button
                onClick={catchSnack}
                style={{ left: `${snackPos.x}%`, top: `${snackPos.y}%` }}
                className="absolute text-5xl transition-all duration-200 hover:scale-125 active:scale-95 animate-bounce cursor-pointer filter drop-shadow"
              >
                {currentSnack}
              </button>
            )}

            {/* Orbiting Mini Food Icons */}
            {!isPlayingGame && (
              <>
                <span className="absolute top-2 left-4 text-xl animate-spin-slow">🍕</span>
                <span className="absolute bottom-4 right-3 text-xl animate-pulse">🍟</span>
                <span className="absolute top-1/2 -left-3 text-xl animate-bounce delay-200">🥑</span>
              </>
            )}
          </div>

          {/* Floating 404 Badge */}
          <div className="absolute -top-1 -right-1 sm:top-0 sm:right-0 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-sm font-black tracking-wider shadow-lg transform rotate-6 hover:rotate-0 transition-transform cursor-default flex items-center gap-1">
            <span>404</span>
            <span className="text-xs font-normal opacity-80">| Empty Plate</span>
          </div>
        </div>

        {/* --- HEADINGS --- */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
          Oops! This plate is empty.
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-md mx-auto leading-relaxed">
          Looks like the page you were looking for got devoured, moved, or never existed in our menu!
        </p>

        {/* --- QUICK SEARCH BAR --- */}
        <form onSubmit={handleSearch} className="mb-6 max-w-md mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search dishes or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-24 py-3 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition shadow-sm text-sm"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* --- POPULAR CATEGORIES QUICK LINKS --- */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Or try hungry-favorite categories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.link}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm hover:border-orange-200 hover:bg-orange-50/50 text-xs font-medium text-gray-700 transition"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* --- PRIMARY NAVIGATION BUTTONS --- */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
          <Button
            as="link"
            to={user ? (user.role === "customer" ? "/" : "/dashboard") : "/"}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto shadow-md shadow-orange-500/10 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {user && user.role !== "customer"
              ? "Back to Dashboard"
              : "Back to Home"}
          </Button>

          <Button
            as="link"
            to="/restaurants"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Explore Restaurants
          </Button>
        </div>

        {/* --- MINI GAME TOGGLE & BACK BUTTON --- */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-orange-500 transition font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go back to previous page
          </button>

          {/* Interactive Easter Egg Mini-Game Toggle */}
          <button
            onClick={() => {
              setIsPlayingGame(!isPlayingGame);
              if (!isPlayingGame) spawnNewSnack();
            }}
            className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/70 px-2.5 py-1 rounded-full transition font-medium"
          >
            {isPlayingGame ? (
              <>
                <RotateCcw className="w-3 h-3" />
                Score: {score} (Stop)
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-amber-500" />
                Bored? Catch snacks!
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}