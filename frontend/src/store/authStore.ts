import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  tenantName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          // MOCKED FOR PREVIEW
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
          const mockUser = {
            id: 'mock-123',
            email: credentials.email,
            firstName: 'Demo',
            lastName: 'User',
            role: 'Admin',
            tenantId: 'tenant-1',
            tenantName: 'Amdox Demo Workspace'
          };
          localStorage.setItem('accessToken', 'mock-token');
          localStorage.setItem('refreshToken', 'mock-refresh');
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
