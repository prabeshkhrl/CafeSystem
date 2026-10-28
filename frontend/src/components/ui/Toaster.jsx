import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      expand={false}
      visibleToasts={4}
      gap={10}
      toastOptions={{
        duration: 3500,
        classNames: {
          toast:
            "rounded-xl border border-gray-100 shadow-lg bg-white text-sm font-medium",
          success: "text-green-800",
          error: "text-red-800",
          warning: "text-yellow-800",
          info: "text-blue-800",
          actionButton: "bg-orange-500 text-white",
          cancelButton: "bg-gray-100 text-gray-700",
        },
      }}
    />
  );
}