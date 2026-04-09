import { create } from 'zustand';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isCheckingAuth: true, // for initial auth check

  checkAuth: async () => {
    try {
      const res = await axios.get('/api/auth/me');
      set({ user: res.data });
    } catch (err) {
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      set({ user: res.data });
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      throw err; // optional: lets UI handle error
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      set({ user: res.data });
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.post('/api/auth/logout');
      set({ user: null });
    } catch (err) {
      console.error('Logout error:', err.response?.data || err.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;