import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import useAuthStore from "../store/useAuthStore";
import { toast } from "../lib/toast";

export function useUpdateRestaurant() {
  const qc = useQueryClient();
  const restaurantId = useAuthStore((s) => s.user?.restaurantId);

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.put(
        `/restaurants/${restaurantId}`,
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant", restaurantId] });
      qc.invalidateQueries({ queryKey: ["restaurants"] });
      toast.success("Restaurant updated");
    },
  });
}

export function useToggleRestaurantActive() {
  const qc = useQueryClient();
  const restaurantId = useAuthStore((s) => s.user?.restaurantId);

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(
        `/restaurants/${restaurantId}/toggle-active`
      );
      return data.data;
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["restaurant", restaurantId] });
      const prev = qc.getQueryData(["restaurant", restaurantId]);
      if (prev) {
        qc.setQueryData(["restaurant", restaurantId], {
          ...prev,
          isActive: !prev.isActive,
        });
      }
      return { prev };
    },
    onSuccess: (updated) => {
      toast.success(
        updated.isActive
          ? "Restaurant is now open"
          : "Restaurant is now closed"
      );
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(["restaurant", restaurantId], ctx.prev);
      }
      toast.error("Failed to update restaurant status");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["restaurant", restaurantId] });
      qc.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
}