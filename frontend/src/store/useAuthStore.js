import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";

 const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (emailOrUsername, password) => {
        const { data } = await api.post("/auth/login", {
          emailOrUsername,
          password,
        });
        set({ token: data.token, user: data.data });
        return data;
      },

      logout: () => set({ user: null, token: null }),

      setUser: (user) => set({ user }),
    }),
    {
      name: "foodhub-auth",
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
);

export default useAuthStore;