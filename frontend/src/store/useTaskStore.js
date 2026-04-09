import { create } from 'zustand';
import axios from 'axios';

const useTaskStore = create((set) => ({
  tasks: [],
  isLoading: false,

  // fetch all tasks
  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get('/api/task');
      set({ tasks: res.data });
    } catch (err) {
      console.error('Fetch tasks error:', err.response?.data || err.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // create task
  createTask: async (taskData) => {
    set({ isLoading: true });
    try {
      const res = await axios.post('/api/task', taskData);
      set((state) => ({
        tasks: [res.data, ...state.tasks],
      }));
    } catch (err) {
      console.error('Create task error:', err.response?.data || err.message);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // update task
  updateTask: async (id, updates) => {
    set({ isLoading: true });
    try {
      const res = await axios.put(`/api/task/${id}`, updates);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t._id === id ? res.data : t
        ),
      }));
    } catch (err) {
      console.error('Update task error:', err.response?.data || err.message);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // delete task
  deleteTask: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete(`/api/task/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
      }));
    } catch (err) {
      console.error('Delete task error:', err.response?.data || err.message);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTaskStore;