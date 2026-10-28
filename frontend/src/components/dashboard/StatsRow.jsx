import { ShoppingBag, DollarSign, Star, Clock } from "lucide-react";
import StatCard from "./StatCard";

export default function StatsRow({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Today's Orders"
        value={stats?.todayOrders ?? 0}
        icon={ShoppingBag}
        accent="orange"
      />
      <StatCard
        label="Today's Revenue"
        value={`Rs. ${(stats?.todayRevenue ?? 0).toFixed(2)}`}
        icon={DollarSign}
        accent="green"
      />
      <StatCard
        label="Pending Orders"
        value={stats?.pendingOrders ?? 0}
        icon={Clock}
        accent="yellow"
      />
      <StatCard
        label="Average Rating"
        value={(stats?.averageRating ?? 0).toFixed(1)}
        icon={Star}
        accent="blue"
        trendLabel={`${stats?.totalReviews ?? 0} reviews`}
      />
    </div>
  );
}