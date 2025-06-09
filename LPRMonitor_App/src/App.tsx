import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { CircularProgress } from '@mui/material';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login';
import CheckUnauthorized from './components/CheckCars/CheckUnauthorized';
import IdentifyCar from './components/CheckCars/IdentifyCar';
import Home from './components/Home';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import RegisterCamera from './components/RegisterCamera/RegisterCamera';
import PageWrapper from './PageWrapper';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <CircularProgress />;
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
    <Route
      path="/check"
      element={
        <PrivateRoute>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <IdentifyCar />
          </LocalizationProvider>
        </PrivateRoute>
      }
    />
        <Route
      path="/register-camera"
      element={
        <PrivateRoute>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RegisterCamera />
          </LocalizationProvider>
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

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
};

export default App;
