import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import App from "./App.jsx";
import Toaster from "./components/ui/Toaster.jsx";
import { toast } from "./lib/toast.js";
import "./index.css";

// ── QueryClient configured with global toast handlers ──
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      if (err?.response?.status === 401) return;
      toast.fromError(err, "Failed to load data");
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      if (err?.response?.status === 401) return;
      toast.fromError(err);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);