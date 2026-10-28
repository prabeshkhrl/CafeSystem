import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FormField from "./FormField";
import PasswordInput from "./PasswordInput";
import Button from "../ui/Button";
import api from "../../lib/api";
import useAuthStore from "../../store/useAuthStore";
import { toast } from "../../lib/toast";

export default function CustomerRegisterForm() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
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
    if (!form.name.trim()) e.name = "Required";
    if (!form.username.trim()) e.username = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.password) e.password = "Required";
    else if (form.password.length < 6)
      e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register/customer", {
        ...form,
        email: form.email.toLowerCase(),
      });

      // store token + user
      useAuthStore.setState({ token: data.token, user: data.data });
      setUser(data.data);
      toast.success("Account created! Let's find you some food.");
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed. Try again."
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
        label="Full Name"
        placeholder="John Doe"
        value={form.name}
        onChange={update("name")}
        error={errors.name}
        required
      />

      <FormField
        label="Username"
        placeholder="johndoe"
        value={form.username}
        onChange={update("username")}
        error={errors.username}
        required
      />

      <FormField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={update("email")}
        error={errors.email}
        required
      />

      <FormField label="Password" required error={errors.password}>
        <PasswordInput
          value={form.password}
          onChange={update("password")}
          error={errors.password}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
      </FormField>

      <FormField
        label="Phone Number"
        placeholder="+977-9800000000"
        value={form.phoneNumber}
        onChange={update("phoneNumber")}
        error={errors.phoneNumber}
      />

      <Button type="submit" size="lg" disabled={loading} className="w-full mt-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-gray-500 pt-2">
        Already have an account?{" "}
        <Link to="/auth" className="font-semibold text-orange-500 hover:text-orange-600">
          Sign in
        </Link>
      </p>
    </form>
  );
}