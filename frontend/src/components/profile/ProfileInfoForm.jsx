import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import FormField from "../auth/FormField";
import Button from "../ui/Button";
import { useUpdateProfile } from "../../hooks/useProfileMutations";

export default function ProfileInfoForm({ user }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});

  const mutation = useUpdateProfile();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.username.trim()) e.username = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    try {
      await mutation.mutateAsync({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.toLowerCase().trim(),
        phoneNumber: form.phoneNumber.trim(),
      });
    } catch {
      // toast already shown by MutationCache / hook
    }
  };

  const dirty =
    user &&
    (form.name !== user.name ||
      form.username !== user.username ||
      form.email !== user.email ||
      form.phoneNumber !== (user.phoneNumber || ""));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">Account details</h2>
        <p className="text-sm text-gray-500">
          Update your name, username, or contact info.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Full Name"
          value={form.name}
          onChange={update("name")}
          error={errors.name}
          required
        />
        <FormField
          label="Username"
          value={form.username}
          onChange={update("username")}
          error={errors.username}
          hint="Used to sign in. Must be unique."
          required
        />
        <FormField
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
          hint="Used to sign in. Must be unique."
          required
        />
        <FormField
          label="Phone Number"
          value={form.phoneNumber}
          onChange={update("phoneNumber")}
          hint="Used for delivery contact."
        />

        <div className="flex justify-end pt-3 border-t border-gray-100">
          <Button type="submit" disabled={mutation.isPending || !dirty}>
            {mutation.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}