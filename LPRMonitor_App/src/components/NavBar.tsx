import React, { use, useState } from 'react';
import { FaAd, FaCannabis, FaCar, FaHome, FaInfoCircle } from 'react-icons/fa';
import logo from '../assets/logo_white.png';
import { motion }from "framer-motion";
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  onLogout: () => void;
} 

const NavBar: React.FC <NavBarProps> = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-[#272932] text-white p-4 space-y-6 align-middle top-0 h-full transition-all duration-500 ease-in-out ${
          menuOpen ? 'w-48' : 'w-20'
        } overflow-hidden`}
      >
        <button
          className="relative w-8 h-8 flex items-center ml-2 justify-center focus:outline-none"
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
          <div className='flex flex-col justify-between h-auto'>
            <div className="space-y-6 ml-2 ">
              <button onClick={() => navigate('/home')}>
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
              <button onClick={() => navigate('/check-unauthorized')}>
                <div className="flex items-center space-x-4">
                  <FaCar className="w-8 h-8" />
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
            <div className={`flex items-center space-x-4 mt-10 ${menuOpen ? 'ml-16' : 'ml-0'}`}>
              <motion.img src={logo} animate={{rotate:360}} transition={{duration: 1}} className="w-12 h-12"/>
            </div>
              <button onClick={onLogout} className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded mt-4">
                Sair
              </button>
          </div>


      </div>
    </div>
  );
};

export default NavBar;
