import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import useAuthStore from "../store/useAuthStore";

export default function useRestaurantOrders({
  status,
  page = 1,
  enabled = true,
} = {}) {
  const user = useAuthStore((s) => s.user);
  const restaurantId = user?.restaurantId;

  return useQuery({
    queryKey: ["restaurant-orders", restaurantId, { status, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      params.set("page", page);
      params.set("limit", 20);

      const { data } = await api.get(
        `/orders/restaurant/${restaurantId}?${params}`
      );
      return data;
    },
    enabled: enabled && !!restaurantId,
    refetchInterval: 15_000, // auto-refresh every 15s
    staleTime: 5_000,
  });
}