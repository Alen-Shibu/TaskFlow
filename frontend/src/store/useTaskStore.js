import { create } from 'zustand';
import axios from 'axios';

const useTaskStore = create((set) => ({
  tasks: [],
  isLoading: false,

  // fetch all tasks from the backend
  fetchTasks: async () => {
    set({ isLoading: true });
    const res = await axios.get('/api/tasks');
    set({ tasks: res.data, isLoading: false });
  },

  // add a new task and push it into the local tasks array
  createTask: async (taskData) => {
    const res = await axios.post('/api/tasks', taskData);
    set((state) => ({ tasks: [res.data, ...state.tasks] }));
  },

  // update a task and replace it in the local array
  updateTask: async (id, updates) => {
    const res = await axios.put(`/api/tasks/${id}`, updates);
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? res.data : t)),
    }));
  },

  // delete a task and remove it from the local array
  deleteTask: async (id) => {
    await axios.delete(`/api/tasks/${id}`);
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id),
    }));
  },
}));

export default useTaskStore;