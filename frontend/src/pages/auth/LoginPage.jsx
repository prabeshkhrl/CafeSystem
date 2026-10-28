import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left — form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              Food<span className="text-orange-500">Hub</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 mb-8">
            Sign in to continue ordering your favorites.
          </p>

          <LoginForm />
        </div>
      </div>

      {/* Right — decorative panel */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-yellow-300/40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-orange-300/40 blur-3xl" />

        <div className="relative max-w-md text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white shadow-lg flex items-center justify-center mb-6">
            <UtensilsCrossed className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Delicious food, delivered fast
          </h2>
          <p className="text-gray-600">
            Order from your favorite restaurants and track your delivery in
            real time.
          </p>
        </div>
      </div>
    </div>
  );
}