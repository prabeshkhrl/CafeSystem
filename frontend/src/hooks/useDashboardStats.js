import { useMemo } from "react";
import useRestaurantOrders from "./useRestaurantOrders";
import useRestaurant from "./useRestaurant";
import useAuthStore from "../store/useAuthStore";

export default function useDashboardStats() {
  const user = useAuthStore((s) => s.user);
  const { data: restaurant } = useRestaurant(user?.restaurantId);
  const { data: ordersData, isLoading } = useRestaurantOrders({ limit: 100 });

  const stats = useMemo(() => {
    const orders = ordersData?.data || [];
    const today = new Date().toDateString();

    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    );

    const todayRevenue = todayOrders
      .filter((o) => o.status !== "cancelled" && o.status !== "rejected")
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) =>
      ["placed", "confirmed", "preparing", "ready"].includes(o.status)
    ).length;

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      pendingOrders,
      averageRating: restaurant?.averageRating || 0,
      totalReviews: restaurant?.totalReviews || 0,
    };
  }, [ordersData, restaurant]);

  return { stats, isLoading };
}