import { useState } from "react";
import { Loader2, Eye, EyeOff, Lock } from "lucide-react";
import FormField from "../auth/FormField";
import PasswordInput from "../auth/PasswordInput";
import Button from "../ui/Button";
import { useChangePassword } from "../../hooks/useProfileMutations";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const mutation = useChangePassword();

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = "Required";
    if (!form.newPassword) e.newPassword = "Required";
    else if (form.newPassword.length < 6)
      e.newPassword = "At least 6 characters";
    else if (form.newPassword === form.currentPassword)
      e.newPassword = "Must be different from current";
    if (!form.confirmPassword) e.confirmPassword = "Required";
    else if (form.confirmPassword !== form.newPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    try {
      await mutation.mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      // toast already shown
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Change password</h2>
          <p className="text-sm text-gray-500">
            Use a strong password. You'll stay logged in after.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Current Password"
          required
          error={errors.currentPassword}
        >
          <PasswordInput
            value={form.currentPassword}
            onChange={update("currentPassword")}
            error={errors.currentPassword}
            placeholder="Enter current password"
            autoComplete="current-password"
          />
        </FormField>

        <FormField
          label="New Password"
          required
          error={errors.newPassword}
        >
          <PasswordInput
            value={form.newPassword}
            onChange={update("newPassword")}
            error={errors.newPassword}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </FormField>

        <FormField
          label="Confirm New Password"
          required
          error={errors.confirmPassword}
        >
          <PasswordInput
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            error={errors.confirmPassword}
            placeholder="Re-enter new password"
            autoComplete="new-password"
          />
        </FormField>

        <div className="flex justify-end pt-3 border-t border-gray-100">
          <Button
            type="submit"
            disabled={mutation.isPending}
            variant="secondary"
          >
            {mutation.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}