import React, { useState } from 'react';
import { FaAd, FaCannabis, FaHome, FaInfoCircle } from 'react-icons/fa';

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-[#272932] text-white p-4 space-y-6 align-middle top-0 h-full transition-all duration-500 ease-in-out ${
          menuOpen ? 'w-48' : 'w-20'
        } overflow-hidden`}
      >
        <button
          className="relative w-8 h-8 flex items-center justify-center focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {/* Linha 1 */}
          <span
            className={`absolute w-6 h-0.5 bg-white transition-transform duration-500 ease-in-out ${
              menuOpen ? 'rotate-45' : '-translate-y-2'
            }`}
          />
          {/* Linha 2 */}
          <span
            className={`absolute w-6 h-0.5 bg-white transition-opacity duration-500 ease-in-out ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {/* Linha 3 */}
          <span
            className={`absolute w-6 h-0.5 bg-white transition-transform duration-500 ease-in-out ${
              menuOpen ? '-rotate-45' : 'translate-y-2'
            }`}
          />
        </button>

        {/* Ícones e Nomes */}
        <div className="space-y-6">
          <button>
            <div className="flex items-center space-x-4">
              <FaHome className="w-8 h-8" />
              <span
                className={`transition-opacity duration-300 font-bold ${
                  menuOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Home
              </span>
            </div>
          </button>
          <button>
            <div className="flex items-center space-x-4">
              <FaInfoCircle className="w-8 h-8" />
              <span
                className={`transition-opacity duration-300 font-bold ${
                  menuOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Informações
              </span>
            </div>
          </button>
          <button>
            <div className="flex items-center space-x-4">
              <FaCannabis className="w-8 h-8" />
              <span
                className={`transition-opacity duration-300 font-bold ${
                  menuOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Usuário
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
