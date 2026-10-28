import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Users, Headphones } from "lucide-react";
import Button from "../ui/Button";

export default function PartnerCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-semibold text-orange-600">
              For restaurant owners
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Grow your restaurant with{" "}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              FoodHub
            </span>
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Reach thousands of hungry customers. Manage your menu, track
            orders, and grow your business — all from one dashboard.
          </p>

          <ul className="space-y-2 mb-8">
            {[
              "Zero setup cost · No monthly fee",
              "Real-time order notifications",
              "Manage menus, images, and reviews",
              "Detailed analytics and reports",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Button as="link" to="/auth/register" size="lg">
              Register your restaurant <ArrowRight className="w-4 h-4" />
            </Button>
            <Button as="link" to="/auth" variant="secondary" size="lg">
              Already a partner? Sign in
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="space-y-4">
          <FeatureRow
            icon={TrendingUp}
            title="Grow faster"
            desc="Get discovered by thousands of new customers every day."
          />
          <FeatureRow
            icon={Users}
            title="Add admins"
            desc="Invite your team to manage orders and inventory."
          />
          <FeatureRow
            icon={Headphones}
            title="Live support"
            desc="Our team is here to help you succeed."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-orange-50 transition">
      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-orange-500" />
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}