import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Case, User } from "../utils/models";

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;

  // UI state
  sidebarCollapsed: boolean;

  // App state
  cases: Case[];

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setToken: (token: string | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCases: (cases: Case[]) => void;
  addCase: (newCase: Case) => void;
  logout: () => void;
  authenticate: (user: User | null, token: string | null) => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

export const userStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      token: null,
      sidebarCollapsed: false,
      cases: [],

      // Actions
      setUser: (user) => set({ user }),

      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

      setToken: (token) => set({ token }),

      authenticate: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: !!user && !!token,
        }),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setCases: (cases) => set({ cases }),

      addCase: (newCase) =>
        set((state) => ({
          cases: [...state.cases, newCase],
        })),

      updateUser: (updatedFields: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null, // Merge updated fields into the existing user object
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          cases: [],
        }),
    }),
    {
      name: "legal-app-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
