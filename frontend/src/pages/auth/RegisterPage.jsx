import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
import RegisterTabs from "../../components/auth/RegisterTabs";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            Food<span className="text-orange-500">Hub</span>
          </span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Create your account
        </h1>
        <p className="text-gray-500 mb-8">
          Join as a customer or start your own restaurant.
        </p>

        <RegisterTabs />
      </div>
    </div>
  );
}