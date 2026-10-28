import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function useOrder(id) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`);
      return data.data;
    },
    enabled: !!id,
    // ⏱ poll every 15s while the order is not terminal
    refetchInterval: (query) => {
      const order = query.state.data;
      if (!order) return false;
      const terminal = ["delivered", "cancelled", "rejected"];
      return terminal.includes(order.status) ? false : 15_000;
    },
  });
}