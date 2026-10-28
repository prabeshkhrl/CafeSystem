import { useState } from "react";
import { User, Store } from "lucide-react";
import CustomerRegisterForm from "./CustomerRegisterForm";
import RestaurantRegisterForm from "./RestaurantRegisterForm";

const tabs = [
  { key: "customer", label: "Customer", icon: User },
  { key: "restaurant", label: "Restaurant Owner", icon: Store },
];

export default function RegisterTabs() {
  const [active, setActive] = useState("customer");

  return (
    <div>
      {/* Tab switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl mb-6">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {active === "customer" ? (
        <CustomerRegisterForm />
      ) : (
        <RestaurantRegisterForm />
      )}
    </div>
  );
}