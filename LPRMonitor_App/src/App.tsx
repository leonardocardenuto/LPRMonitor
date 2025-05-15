import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import CheckUnauthorized from './components/CheckUnauthorized';
import Home from './components/Home';

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
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
