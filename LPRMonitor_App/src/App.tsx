import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Camera from './components/containers/Camera';
import NewPlateProps from './components/containers/NewPlate/NewPlate';
import LastCars from './components/containers/LastCars/LastCars';
import UnauthorizedCarsTable from './components/containers/UnauthorizedCars/UnauthorizedCars';
import Login from './components/containers/Auth/Login';
import { postLogin } from './components/containers/Auth/services/AuthService';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

const Home: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <div className="flex h-screen bg-[#DEE5E5]">
    <NavBar onLogout={onLogout} />
    <div className="flex-1 m-8 relative">
      <Camera />
      <LastCars />
      <NewPlateProps />
      <UnauthorizedCarsTable />
    </div>
  </div>
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const handleLogin = async (
    username: string,
    senha: string,
    setError: (msg: string) => void
  ) => {
    try {
      const data = await postLogin(username, senha);
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      setError('');
    } catch (error) {
      setError('Username ou senha inválidos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;