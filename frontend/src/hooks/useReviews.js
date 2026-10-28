import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function useReviews(restaurantId, { page = 1, limit = 5 } = {}) {
  return useQuery({
    queryKey: ["reviews", restaurantId, { page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", limit);
      const { data } = await api.get(
        `/reviews/restaurant/${restaurantId}?${params}`
      );
      return data;
    },
    enabled: !!restaurantId,
    staleTime: 30_000,
  });
}