import { Link } from "react-router-dom";
import Logo from "./Logo";

const columns = [
  {
    title: "Explore",
    links: [
      { to: "/restaurants", label: "Restaurants" },
      { to: "/orders", label: "My Orders" },
      { to: "/cart", label: "Cart" },
    ],
  },
  {
    title: "For Business",
    links: [
      { to: "/auth/register", label: "Become a Partner" },
      { to: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "#", label: "Help Center" },
      { to: "#", label: "Contact Us" },
      { to: "#", label: "Privacy Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-3">
              <Logo />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Delicious food from your favorite restaurants, delivered fast to
              your door.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-gray-900 mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-orange-500 transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FoodHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}