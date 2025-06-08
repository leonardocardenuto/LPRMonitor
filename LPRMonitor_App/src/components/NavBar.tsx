import React, { useState } from 'react';
import { FaCamera, FaCameraRetro, FaCar, FaHome, FaInfoCircle } from 'react-icons/fa';
import logo from '../assets/logo_white.png';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExitToApp } from '@mui/icons-material';

interface NavBarProps {
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen">
      <div
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
        className={`bg-[#272932] text-white p-4 space-y-6 flex flex-col justify-between top-0 h-full transition-all duration-500 ease-in-out ${
          menuOpen ? 'w-48' : 'w-20'
        } overflow-hidden`}
      >
        <div>
          <button
            className="relative w-8 h-8 flex items-center ml-2 justify-center focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={`absolute w-6 h-0.5 bg-white transition-transform duration-500 ease-in-out ${
                menuOpen ? 'rotate-45' : '-translate-y-2'
              }`}
            />
            <span
              className={`absolute w-6 h-0.5 bg-white transition-opacity duration-500 ease-in-out ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute w-6 h-0.5 bg-white transition-transform duration-500 ease-in-out ${
                menuOpen ? '-rotate-45' : 'translate-y-2'
              }`}
            />
          </button>

          <div className="space-y-6 ml-2 mt-6">
            <button onClick={() => navigate('/')}>
              <div className="flex items-center space-x-4">
                <FaHome className={`w-8 h-8 ${location.pathname === '/' ? 'text-[#8594d8]' : ''}`} />
                <span
                  className={`transition-opacity duration-300 font-bold ${
                    menuOpen ? 'opacity-100' : 'opacity-0'
                  } ${location.pathname === '/' ? 'text-[#8594d8]' : ''}`}
                >
                  Home
                </span>
              </div>
            </button>
            <button onClick={() => navigate('/check-unauthorized')}>
              <div className="flex items-center space-x-4">
                <FaCar className={`w-8 h-8 ${location.pathname === '/check-unauthorized' ? 'text-[#8594d8]' : ''}`} />
                <span
                  className={`transition-opacity duration-300 font-bold ${
                    menuOpen ? 'opacity-100' : 'opacity-0'
                  } ${location.pathname === '/check-unauthorized' ? 'text-[#8594d8]' : ''}`}
                >
                  Usuário
                </span>
              </div>
            </button>
            <button onClick={() => navigate('/register-camera')}>
              <div className="flex items-center space-x-4">
                <FaCameraRetro className={`w-8 h-8 ${location.pathname === '/register-camera' ? 'text-[#8594d8]' : ''}`} />
                <span
                  className={`transition-opacity duration-300 font-bold ${
                    menuOpen ? 'opacity-100' : 'opacity-0'
                  } ${location.pathname === '/register-camera' ? 'text-[#8594d8]' : ''}`}
                >
                  Registrar
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center w-10 px-0">
          {!menuOpen ? (
            <motion.img
              src={logo}
              animate={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="w-12 h-12 mb-6"
            />
          ) : null}
          <div className="flex items-center space-x-4">
            <ExitToApp
              onClick={handleLogout}
              className="cursor-pointer text-gray-300 hover:text-red-600 transition-colors duration-300 ml-12"
              fontSize="large"
              titleAccess="Sair"
            />
            <span
              className={`transition-opacity duration-300 font-bold ${
                menuOpen ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Sair
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;