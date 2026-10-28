import MenuItemCard from "./MenuItemCard";
import EmptyState from "../common/EmptyState";
import { UtensilsCrossed } from "lucide-react";

export default function MenuItemList({ items, restaurant, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse h-32 bg-gray-50 rounded-2xl border border-gray-100"
          />
        ))}
      </div>
    );
  }

  if (!items?.length) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="No menu items yet"
        description="This restaurant hasn't added any items in this category."
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <MenuItemCard key={item._id} item={item} restaurant={restaurant} />
      ))}
    </div>
  );
}