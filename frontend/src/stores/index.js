import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      
      login: async (email, password) => {
        try {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
          }
          
          const data = await response.json();
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
          return data;
        } catch (error) {
          throw error;
        }
      },
      
      register: async (email, password, name, rada) => {
        try {
          const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password, name, rada })
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
          }
          
          const data = await response.json();
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
          return data;
        } catch (error) {
          throw error;
        }
      },
      
      logout: async () => {
        try {
          await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
          });
        } catch (e) {
          // Ignore errors
        }
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },
      
      checkAuth: async () => {
        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            const user = await response.json();
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
);

// UI Store
export const useUIStore = create((set) => ({
  theme: 'light',
  mobileMenuOpen: false,
  selectedRada: 'all',
  
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setSelectedRada: (rada) => set({ selectedRada: rada })
}));

// News Store
export const useNewsStore = create((set) => ({
  news: [],
  isLoading: false,
  error: null,
  
  fetchNews: async (rada = null, category = null) => {
    set({ isLoading: true, error: null });
    try {
      let url = `${API_URL}/api/news?limit=50`;
      if (rada) url += `&rada=${rada}`;
      if (category) url += `&category=${category}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      set({ news: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));

// Announcements Store
export const useAnnouncementsStore = create((set) => ({
  announcements: [],
  isLoading: false,
  error: null,
  
  fetchAnnouncements: async (rada = null, category = null) => {
    set({ isLoading: true, error: null });
    try {
      let url = `${API_URL}/api/announcements?limit=50`;
      if (rada) url += `&rada=${rada}`;
      if (category) url += `&category=${category}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch announcements');
      
      const data = await response.json();
      set({ announcements: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));

// Radas Store
export const useRadasStore = create((set) => ({
  radas: [],
  isLoading: false,
  
  fetchRadas: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/radas`);
      if (!response.ok) throw new Error('Failed to fetch radas');
      
      const data = await response.json();
      set({ radas: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  
  getRada: (id) => {
    const { radas } = useRadasStore.getState();
    return radas.find(r => r.id === id);
  }
}));
