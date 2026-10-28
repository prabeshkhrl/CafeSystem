import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import useAuthStore from "../store/useAuthStore";
import { toast } from "../lib/toast";

export function useCreateMenuItem() {
  const qc = useQueryClient();
  const restaurantId = useAuthStore((s) => s.user?.restaurantId);

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/menu-items", {
        ...payload,
        restaurantId,
      });
      return data.data;
    },
    onSuccess: (item) => {
      qc.invalidateQueries({ queryKey: ["dashboard-menu-items"] });
      qc.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success(`"${item.name}" added to menu`);
    },
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put(`/menu-items/${id}`, payload);
      return data.data;
    },
    onSuccess: (item) => {
      qc.invalidateQueries({ queryKey: ["dashboard-menu-items"] });
      qc.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success(`"${item.name}" updated`);
    },
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/menu-items/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard-menu-items"] });
      qc.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Menu item deleted");
    },
  });
}

export function useToggleMenuItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(
        `/menu-items/${id}/toggle-availability`
      );
      return data.data;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["dashboard-menu-items"] });
      const prev = qc.getQueryData(["dashboard-menu-items"]);

      if (prev) {
        qc.setQueryData(["dashboard-menu-items"], (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((it) =>
              it._id === id ? { ...it, isAvailable: !it.isAvailable } : it
            ),
          };
        });
      }
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["dashboard-menu-items"], ctx.prev);
      toast.error("Failed to update availability");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["dashboard-menu-items"] });
      qc.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
}