import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: (item, restaurantId) => {
        const current = get();
        // enforce single-restaurant cart
        if (current.restaurantId && current.restaurantId !== restaurantId) {
          if (
            !window.confirm(
              "Your cart has items from another restaurant. Clear cart and add this item?"
            )
          )
            return;
          set({ items: [], restaurantId: null });
        }

        const existing = get().items.find((i) => i._id === item._id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: 1 }],
            restaurantId,
          });
        }
      },

      removeItem: (id) =>
        set({
          items: get().items.filter((i) => i._id !== id),
        }),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return get().removeItem(id);
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [], restaurantId: null }),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "foodhub-cart" }
  )
);

export default useCartStore;