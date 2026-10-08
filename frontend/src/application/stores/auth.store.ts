import { create } from "zustand";
import { devtools } from "zustand/middleware";
import settings from "@/infrastructure/settings";

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    token: localStorage.getItem(settings.tokenKey),

    setAuth: (user, token) => {
      localStorage.setItem(settings.tokenKey, token);
      set({ user, token }, false, "auth/setAuth");
    },

    logout: () => {
      localStorage.removeItem(settings.tokenKey);
      set({ user: null, token: null }, false, "auth/logout");
    },
  })),
);
