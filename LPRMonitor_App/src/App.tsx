import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/Home';
import CheckUnauthorized from './components/CheckUnauthorized';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CircularProgress } from '@mui/material';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <CircularProgress/>;
  }

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};


const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />
    <Route
      path="/check-unauthorized"
      element={
        <PrivateRoute>
          <CheckUnauthorized />
        </PrivateRoute>
      }
    />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;