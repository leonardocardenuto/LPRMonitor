import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Camera from './components/containers/Camera';
import NewPlateProps from './components/containers/NewPlate/NewPlate';
import LastCars from './components/containers/LastCars/LastCars';
import UnauthorizedCarsTable from './components/containers/UnauthorizedCars/UnauthorizedCars';
import Login from './components/containers/Auth/Login'; 
import { postLogin } from './components/containers/Auth/services/AuthService';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await postLogin(username,senha);
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      setErro('');
    } catch (error) {
      setErro('Username ou senha inválidos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    setSenha('');
    setErro('');
  };

  return isLoggedIn ? (
    <div className="flex h-screen bg-[#DEE5E5]">
      <NavBar onLogout={handleLogout} />
      <div className="flex-1 m-8 relative">
        <Camera />
        <LastCars />
        <NewPlateProps />
        <UnauthorizedCarsTable />
      </div>
    </div>
  ) : (
    <Login
      username={username}
      senha={senha}
      erro={erro}
      setUsername={setUsername}
      setSenha={setSenha}
      onSubmit={handleLogin}
    />
  );
};

export default App;