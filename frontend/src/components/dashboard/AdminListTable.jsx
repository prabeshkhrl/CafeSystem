import { useState } from "react";
import { UserPlus, Trash2, Loader2, Users } from "lucide-react";
import Button from "../ui/Button";
import InviteAdminModal from "./InviteAdminModal";
import { useDeleteAdmin } from "../../hooks/useAdmins";
import EmptyState from "../common/EmptyState";

export default function AdminListTable({ admins, isLoading }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const del = useDeleteAdmin();

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await del.mutateAsync(deleting._id);
      setDeleting(null);
    } catch {
      /* keep modal open */
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!admins?.length) {
    return (
      <>
        <div className="bg-white rounded-2xl border border-gray-100">
          <EmptyState
            icon={Users}
            title="No admins yet"
            description="Invite someone to help manage your restaurant's orders, menu, and reviews."
            actionLabel="Invite admin"
            onAction={() => setModalOpen(true)}
          />
        </div>
        <InviteAdminModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {admins.length} {admins.length === 1 ? "admin" : "admins"}
        </p>
        <Button onClick={() => setModalOpen(true)}>
          <UserPlus className="w-4 h-4" /> Invite Admin
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {admins.map((admin) => {
            const initials = admin.name?.charAt(0).toUpperCase() || "A";
            const joined = new Date(admin.createdAt).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" }
            );

            return (
              <div
                key={admin._id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 truncate">
                      {admin.name}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                      Admin
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    @{admin.username} · {admin.email}
                  </p>
                  {admin.phoneNumber && (
                    <p className="text-xs text-gray-400">
                      {admin.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400">Joined</p>
                  <p className="text-xs text-gray-600">{joined}</p>
                </div>

                <button
                  onClick={() => setDeleting(admin)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                  aria-label="Remove admin"
                  title="Remove admin"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <InviteAdminModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Delete confirm */}
      {deleting && (
        <>
          <div
            onClick={() => !del.isPending && setDeleting(null)}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    Remove{" "}
                    <strong className="text-gray-900">
                      {deleting.name}
                    </strong>{" "}
                    as an admin?
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    They will lose access to your dashboard immediately.
                  </p>
                </div>
              </div>

              {del.isError && (
                <p className="text-xs text-red-600 mb-3">
                  {del.error?.response?.data?.message ||
                    "Failed to remove admin"}
                </p>
              )}

              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setDeleting(null)}
                  disabled={del.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  disabled={del.isPending}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {del.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}