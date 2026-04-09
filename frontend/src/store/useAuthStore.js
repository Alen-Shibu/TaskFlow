import { create } from 'zustand';
import axios from 'axios';

// axios base url so we don't repeat it everywhere
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true; // send cookies with every request (for JWT cookie)

const useAuthStore = create((set) => ({
  user: null,         // logged in user object, null if not logged in
  isLoading: false,   // for showing loading states on buttons

  // called on app load to check if user is already logged in via cookie
  checkAuth: async () => {
    try {
      const res = await axios.get('/api/auth/me');
      set({ user: res.data });
    } catch {
      set({ user: null });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    const res = await axios.post('/api/auth/register', { name, email, password });
    set({ user: res.data, isLoading: false });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    const res = await axios.post('/api/auth/login', { email, password });
    set({ user: res.data, isLoading: false });
  },

  logout: async () => {
    await axios.post('/api/auth/logout');
    set({ user: null });
  },
}));

export default useAuthStore;