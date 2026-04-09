import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import Register from './pages/Register';
import Login from './pages/Login';
import TaskPage from './pages/TaskPage';
import './App.css';

function App() {
  const { user, checkAuth } = useAuthStore();

  // on first load, check if a valid cookie session exists
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* if not logged in, redirect to login */}
        <Route path="/" element={user ? <TaskPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;