import { Search, ShoppingBag, Truck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find a restaurant",
    desc: "Browse local restaurants and explore their menus.",
    emoji: "🔍",
  },
  {
    icon: ShoppingBag,
    title: "Add to cart",
    desc: "Pick your favorites and check out in seconds.",
    emoji: "🛒",
  },
  {
    icon: Truck,
    title: "Track your order",
    desc: "Watch your food being prepared and delivered live.",
    emoji: "🚴",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          How it works
        </h2>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto">
          Ordering from your favorite restaurants has never been easier.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 relative">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="relative bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition"
            >
              {/* Step number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-md">
                {i + 1}
              </div>

              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center mb-4 mt-2 text-3xl">
                {step.emoji}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}