import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'operator' | 'maintenance' | 'supervisor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  login: (user: User) => void;
  signup: (user: User) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,
      login: (user) => set({ isAuthenticated: true, user, error: null, isLoading: false }),
      signup: (user) => set({ isAuthenticated: true, user, error: null, isLoading: false }),
      logout: () => set({ isAuthenticated: false, user: null, error: null }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'cortexops-auth-session',
    }
  )
);
