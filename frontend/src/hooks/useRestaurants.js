import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function useRestaurants({ search, isActive, page = 1 } = {}) {
  return useQuery({
    queryKey: ["restaurants", { search, isActive, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (isActive !== undefined) params.set("isActive", isActive);
      params.set("page", page);
      params.set("limit", 12);

      const { data } = await api.get(`/restaurants?${params}`);
      return data; // { data, total, page, pages, count }
    },
    staleTime: 30_000,
  });
}