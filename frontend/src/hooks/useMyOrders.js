import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function useMyOrders({ status, page = 1 } = {}) {
  return useQuery({
    queryKey: ["my-orders", { status, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      params.set("page", page);
      params.set("limit", 10);
      const { data } = await api.get(`/orders/my?${params}`);
      return data;
    },
    staleTime: 10_000,
  });
}