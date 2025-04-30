import React, { useState } from 'react';
import { FaHome, FaInfoCircle, FaContao } from 'react-icons/fa'; // Ícones

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Controle de expansão do menu

  return (
    <div className="flex h-screen">
      {/* Barra Lateral */}
      <div
        className={`bg-blue-600 text-white p-4 space-y-6 align-middle top-0 h-full transition-all duration-300 ${
          menuOpen ? 'w-50' : 'w-20'
        }`} // Largura variando com base no estado menuOpen
      >
        {/* Botão Hambúrguer */}
        <button
          className="text-white"
          onClick={() => setMenuOpen(!menuOpen)} // Controla a expansão
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Ícones e Nomes */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <FaHome className="w-6 h-6" />
            {menuOpen && <span>Início</span>} {/* Nomes aparecem quando menu está aberto */}
          </div>
          <div className="flex items-center space-x-4">
            <FaInfoCircle className="w-6 h-6" />
            {menuOpen && <span>Sobre</span>}
          </div>
          <div className="flex items-center space-x-4">
            <FaContao className="w-6 h-6" />
            {menuOpen && <span>Contato</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
