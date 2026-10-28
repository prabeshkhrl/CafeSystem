import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";
import PasswordInput from "./PasswordInput";
import Button from "../ui/Button";
import useAuthStore from "../../store/useAuthStore";
import { toast } from "../../lib/toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.emailOrUsername.trim()) e.emailOrUsername = "Required";
    if (!form.password) e.password = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login(form.emailOrUsername.trim(), form.password);

      // redirect: back to where they came from, or role-based default
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (data.data.role === "restaurantOwner" || data.data.role === "admin") {
        toast.success(`Welcome back, ${data.data.name?.split(" ")[0] || "friend"}!`);
        navigate("/dashboard", { replace: true });
      } else {
        toast.success(`Welcome back, ${data.data.name?.split(" ")[0] || "friend"}!`);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <FormField
        label="Email or Username"
        placeholder="you@example.com or username"
        value={form.emailOrUsername}
        onChange={update("emailOrUsername")}
        error={errors.emailOrUsername}
        required
        autoComplete="username"
      />

      <FormField label="Password" required error={errors.password}>
        <PasswordInput
          value={form.password}
          onChange={update("password")}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </FormField>

      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="w-full mt-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-gray-500 pt-2">
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          className="font-semibold text-orange-500 hover:text-orange-600"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}