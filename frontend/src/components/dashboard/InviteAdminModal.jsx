import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import Modal from "../ui/Modal";
import FormField from "../auth/FormField";
import PasswordInput from "../auth/PasswordInput";
import Button from "../ui/Button";
import { useCreateAdmin } from "../../hooks/useAdmins";

const initialForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
};

export default function InviteAdminModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const create = useCreateAdmin();

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

  const reset = () => {
    setForm(initialForm);
    setErrors({});
    setServerError("");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await create.mutateAsync({
        ...form,
        email: form.email.toLowerCase(),
      });
      reset();
      onClose();
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to create admin"
      );
    }
  };

  const handleClose = () => {
    if (create.isPending) return;
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Invite Admin" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-xs text-orange-700 leading-relaxed">
          Admins can manage your menu, process orders, and reply to reviews —
          but cannot create other admins or change your restaurant settings.
        </div>

        {serverError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <FormField
          label="Full Name"
          placeholder="Pizza Palace Manager"
          value={form.name}
          onChange={update("name")}
          error={errors.name}
          required
        />
        <FormField
          label="Username"
          placeholder="pizzamanager"
          value={form.username}
          onChange={update("username")}
          error={errors.username}
          required
        />
        <FormField
          label="Email"
          type="email"
          placeholder="manager@pizzapalace.com"
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
        />

        <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={create.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            Create Admin
          </Button>
        </div>
      </form>
    </Modal>
  );
}