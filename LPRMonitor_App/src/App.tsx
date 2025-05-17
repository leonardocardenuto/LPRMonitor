import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Login from './components/Login';
import CheckUnauthorized from './components/CheckCars/CheckUnauthorized';
import Home from './components/Home';
import IdentifyCar from './components/CheckCars/IdentifyCar';
import { LocalizationProvider } from '@mui/x-date-pickers';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/"
          element={isLoggedIn ? <Home setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />}
        />
         <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />       
        <Route
          path="/check-unauthorized"
          element={
            isLoggedIn ? (
              <CheckUnauthorized setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/check"
          element={
            isLoggedIn ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* Seu componente com DatePicker, etc */}
                    <IdentifyCar setIsLoggedIn={setIsLoggedIn} />
                  </LocalizationProvider>
              
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
