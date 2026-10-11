import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import Admin from './Admin.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { useAuthStore } from './stores/authStore';

function AppWrapper() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<App />} />
      
      {/* Admin login - public */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Admin panel - protected, requires admin role */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Admin />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<App />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </React.StrictMode>
);
