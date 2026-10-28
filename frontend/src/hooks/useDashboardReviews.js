import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import useAuthStore from "../store/useAuthStore";

export default function useDashboardReviews({ page = 1 } = {}) {
  const restaurantId = useAuthStore((s) => s.user?.restaurantId);

  return useQuery({
    queryKey: ["dashboard-reviews", restaurantId, { page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", 10);
      const { data } = await api.get(
        `/reviews/restaurant/${restaurantId}?${params}`
      );
      return data;
    },
    enabled: !!restaurantId,
    staleTime: 30_000,
  });
}