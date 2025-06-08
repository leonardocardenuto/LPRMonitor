import React from 'react';
import ProtectedLayout from '../ProtectedLayout';
import UnauthorizedCarsTable from '../HomeContainers/UnauthorizedCars/UnauthorizedCars';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CheckUnauthorized: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <ProtectedLayout onLogout={logout}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Carros Não Autorizados</h1>
        <button
          onClick={() => navigate('/register-car')}
          className="flex items-center bg-[#272932] text-white px-4 py-2 rounded hover:bg-[#4c5061] transition"
        >
          <FaPlus className="mr-2" />
          Identificar Carro
        </button>
      </div>
      <UnauthorizedCarsTable />
    </ProtectedLayout>
  );  
};

export default CheckUnauthorized;