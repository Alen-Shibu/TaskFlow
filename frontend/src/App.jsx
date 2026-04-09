import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import Register from './pages/Register';
import Login from './pages/Login';
import TaskPage from './pages/TaskPage';
import './App.css';
import PageLoader from './components/PageLoader';

function App() {
  const { user, isCheckingAuth, checkAuth } = useAuthStore();

  // on first load, check if a valid cookie session exists
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <PageLoader />; 
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <TaskPage /> : <Navigate to="/register" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;