import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Camera from './components/containers/Camera';
import NewPlateProps from './components/containers/NewPlate';
import LastCars from './components/containers/LastCars/LastCars';
import UnauthorizedCarsTable from './components/containers/UnauthorizedCars/UnauthorizedCars';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@email.com' && senha === '123456') {
      localStorage.setItem('token', 'simulacao-token');
      setIsLoggedIn(true);
    } else {
      setErro('Email ou senha inválidos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    // Tela inicial (usuário logado)
    <div className="flex h-screen bg-[#DEE5E5]">
      <NavBar onLogout={handleLogout} />
      <div className="flex-1 m-8 relative">
        <div><Camera /></div>
        <div><LastCars /></div>
        <div><NewPlateProps /></div>
        <div><UnauthorizedCarsTable /></div>
      </div>
    </div>
  ) : (
    // Tela de login (usuário não logado)
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-2 border rounded"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
