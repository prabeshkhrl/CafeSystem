import { useState } from "react";
import { Pencil, Trash2, Plus, UtensilsCrossed } from "lucide-react";
import AvailabilityToggle from "./AvailabilityToggle";
import MenuItemFormModal from "./MenuItemFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Button from "../ui/Button";
import {
  useToggleMenuItem,
  useDeleteMenuItem,
} from "../../hooks/useMenuMutations";

export default function MenuItemTable({ items, isLoading }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const toggle = useToggleMenuItem();
  const del = useDeleteMenuItem();

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await del.mutateAsync(deleting._id);
      setDeleting(null);
    } catch {
      /* toast/keep modal */
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!items?.length) {
    return (
      <>
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No menu items yet
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Add your first menu item to start selling.
          </p>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>

        <MenuItemFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initial={editing}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
            >
              {/* Image */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100 shrink-0">
                {item.menuItemImage ? (
                  <img
                    src={item.menuItemImage}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">
                    🍽️
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {item.category}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-gray-500 truncate max-w-md">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="text-right hidden sm:block">
                <p className="font-bold text-orange-600">
                  Rs. {item.price.toFixed(2)}
                </p>
              </div>

              {/* Availability toggle */}
              <div className="hidden md:flex items-center gap-2">
                <AvailabilityToggle
                  checked={item.isAvailable}
                  onChange={() => toggle.mutate(item._id)}
                  disabled={toggle.isPending}
                />
                <span className="text-xs text-gray-500 w-20">
                  {item.isAvailable ? "Available" : "Hidden"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition"
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleting(item)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MenuItemFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
      />

      <DeleteConfirmModal
        open={!!deleting}
        itemName={deleting?.name || ""}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        isLoading={del.isPending}
      />
    </>
  );
}