import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function useMenuItems(restaurantId) {
  return useQuery({
    queryKey: ["menu-items", restaurantId],
    queryFn: async () => {
      const { data } = await api.get(
        `/menu-items/restaurant/${restaurantId}`
      );
      return data; // { data: [...], count, restaurant }
    },
    enabled: !!restaurantId,
    staleTime: 30_000,
  });
}