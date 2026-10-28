import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function useRestaurant(id) {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const { data } = await api.get(`/restaurants/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}