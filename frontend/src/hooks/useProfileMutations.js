import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import useAuthStore from "../store/useAuthStore";
import { toast } from "../lib/toast";

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch("/users/me", payload);
      return data.data;
    },
    onSuccess: (updatedUser) => {
      // keep auth store in sync → header avatar/name update immediately
      setUser(updatedUser);
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch("/users/me/password", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
  });
}