import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import useAuthStore from "../store/useAuthStore";

export default function useDashboardMenuItems() {
  const user = useAuthStore((s) => s.user);
  const restaurantId = user?.restaurantId;

  return useQuery({
    queryKey: ["dashboard-menu-items", restaurantId],
    queryFn: async () => {
      const { data } = await api.get(
        `/menu-items/restaurant/${restaurantId}`
      );
      return data; // { data: [...], count, restaurant }
    },
    enabled: !!restaurantId,
    staleTime: 10_000,
  });
}