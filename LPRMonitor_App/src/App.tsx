// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';

import Camera from './components/containers/Camera';
import Home from './components/containers/Home';
import NewPlate from './components/containers/NewPlate/NewPlate';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-[#DEE5E5]">
        <NavBar />
        <div className="flex-1 m-8 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/NewPlate" element={<NewPlate />} />
            {/* Adicione outras rotas conforme necessário */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
