import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { toast } from "../lib/toast";

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }) => {
      const { data } = await api.patch(`/orders/${id}/cancel`, { reason });
      return data.data;
    },
    onSuccess: (_updated, { id }) => {
      qc.invalidateQueries({ queryKey: ["order", id] });
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      qc.invalidateQueries({ queryKey: ["restaurant-orders"] });
      toast.success("Order cancelled");
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, note }) => {
      const { data } = await api.patch(`/orders/${id}/status`, {
        status,
        note,
      });
      return data.data;
    },
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["order", updated._id] });
      qc.invalidateQueries({ queryKey: ["restaurant-orders"] });
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      const label = updated.status.replace(/_/g, " ");
      toast.success(`Order marked ${label}`);
    },
  });
}