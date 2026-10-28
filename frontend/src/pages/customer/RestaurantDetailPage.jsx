import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import useRestaurant from "../../hooks/useRestaurant";
import useMenuItems from "../../hooks/useMenuItems";
import useReviews from "../../hooks/useReviews";
import RestaurantHeader from "../../components/restaurant/RestaurantHeader";
import CategoryFilter from "../../components/menu/CategoryFilter";
import MenuItemList from "../../components/menu/MenuItemList";
import CartDrawer from "../../components/cart/CartDrawer";
import ReviewSummaryBox from "../../components/review/ReviewSummaryBox";
import ReviewList from "../../components/review/ReviewList";
import useCartStore from "../../store/useCartStore";
import useAuthStore from "../../store/useAuthStore";
import { useDeleteReview } from "../../hooks/useReviewMutations";
import ReviewCard from "../../components/review/ReviewCard";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { data: restaurant, isLoading: restLoading } = useRestaurant(id);
  const { data: menuData, isLoading: menuLoading } = useMenuItems(id);

  const user = useAuthStore((s) => s.user);
  const [reviewPage, setReviewPage] = useState(1);
  const { data: reviewsData, isLoading: reviewsLoading } = useReviews(id, {
    page: reviewPage,
  });

  const del = useDeleteReview();

  const [category, setCategory] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const cartRestaurant = useCartStore((s) => s.restaurantId);

  const categories = useMemo(() => {
    const set = new Set();
    (menuData?.data || []).forEach((i) => set.add(i.category));
    return Array.from(set).sort();
  }, [menuData]);

  const filtered = useMemo(() => {
    const items = menuData?.data || [];
    return category === "all"
      ? items
      : items.filter((i) => i.category === category);
  }, [menuData, category]);

  if (restLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse h-64 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
        Restaurant not found.
      </div>
    );
  }

  /**
   * Returns a delete handler IF the logged-in user authored this review.
   * Otherwise returns undefined → ReviewCard hides the trash icon.
   */
  const getOnDelete = (review) => {
    if (!user) return undefined;
    const authorId =
      typeof review.customerId === "string"
        ? review.customerId
        : review.customerId?._id;
    if (authorId !== user._id) return undefined;

    return (reviewId) => del.mutateAsync(reviewId);
  };

  return (
    <div className="pb-24">
      <RestaurantHeader restaurant={restaurant} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Menu</h2>
          {categories.length > 0 && (
            <CategoryFilter
              categories={categories}
              selected={category}
              onSelect={setCategory}
            />
          )}
          <div className="mt-6">
            <MenuItemList
              items={filtered}
              restaurant={restaurant}
              isLoading={menuLoading}
            />
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
          <ReviewSummaryBox restaurant={restaurant} />

          {/* Custom rendering so each card gets its own delete decision */}
          {reviewsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(reviewsData?.data || []).map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onDelete={getOnDelete(review)}
                  isDeleting={
                    del.isPending && del.variables === review._id
                  }
                />
              ))}
            </div>
          )}

          {(reviewsData?.pages || 1) > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={reviewPage <= 1}
                onClick={() => setReviewPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500 px-3">
                Page {reviewPage} of {reviewsData.pages}
              </span>
              <button
                disabled={reviewPage >= (reviewsData?.pages || 1)}
                onClick={() => setReviewPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {cartCount > 0 && cartRestaurant === id && (
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-xl px-6 py-4 flex items-center gap-3 font-semibold z-30 hover:shadow-2xl transition"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount} {cartCount === 1 ? "item" : "items"} · View cart
        </button>
      )}

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}