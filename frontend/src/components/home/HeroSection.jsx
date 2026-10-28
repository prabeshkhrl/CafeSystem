import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Sparkles, UtensilsCrossed, Star } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/restaurants?search=${encodeURIComponent(q)}` : "/restaurants");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-yellow-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-orange-100 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-semibold text-orange-600">
                Delivering in Kathmandu · 30 min or less
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Delicious food,
              <br />
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                delivered fast.
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
              Order from your favorite local restaurants and track your
              delivery in real time. Pay with cash, eSewa, or Khalti.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-white rounded-full shadow-lg p-2 max-w-lg mb-6 border border-gray-100"
            >
              <div className="flex items-center pl-3 pr-2 flex-1">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search restaurants or dishes..."
                  className="bg-transparent outline-none text-sm w-full ml-2 placeholder:text-gray-400"
                />
              </div>
              <Button type="submit" size="md">
                Find food
              </Button>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Button as="link" to="/restaurants" variant="primary" size="lg">
                Browse restaurants <ArrowRight className="w-4 h-4" />
              </Button>
              <Button as="link" to="/auth/register" variant="secondary" size="lg">
                Become a partner
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {["P", "R", "S", "A"].map((l, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">10,000+</span>{" "}
                happy customers
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-400">4.9 / 5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: illustration */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Big circular plate */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300" />
              <div className="absolute inset-6 rounded-full bg-white shadow-2xl flex items-center justify-center">
                <div className="text-[10rem] leading-none">🍕</div>
              </div>

              {/* Floating cards */}
              <FloatCard
                className="top-4 -left-4"
                icon="⭐"
                title="4.9 rating"
                subtitle="From 2,300+ reviews"
              />
              <FloatCard
                className="bottom-8 -right-6"
                icon="🚀"
                title="Fast delivery"
                subtitle="Under 30 minutes"
              />
              <FloatCard
                className="bottom-2 -left-6"
                icon="💳"
                title="Pay your way"
                subtitle="Cash, eSewa, Khalti"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatCard({ className = "", icon, title, subtitle }) {
  return (
    <div
      className={`absolute bg-white rounded-2xl shadow-xl p-3 pr-4 flex items-center gap-3 border border-gray-100 ${className}`}
    >
      <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-gray-900 whitespace-nowrap">
          {title}
        </p>
        <p className="text-[10px] text-gray-500 whitespace-nowrap">
          {subtitle}
        </p>
      </div>
    </div>
  );
}