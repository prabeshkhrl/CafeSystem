import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

/* ---------- list ---------- */
export function useMyAdmins() {
  return useQuery({
    queryKey: ["my-admins"],
    queryFn: async () => {
      const { data } = await api.get("/admins");
      return data;
    },
    staleTime: 30_000,
  });
}

/* ---------- create ---------- */
export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/auth/register/admin", payload);
      return data.data;
    },
    onSuccess: (admin) => {
      qc.invalidateQueries({ queryKey: ["my-admins"] });
      toast.success(`Admin "${admin.name}" created`);
    },
  });
}

export function useDeleteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admins/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-admins"] });
      toast.success("Admin removed");
    },
  });
}