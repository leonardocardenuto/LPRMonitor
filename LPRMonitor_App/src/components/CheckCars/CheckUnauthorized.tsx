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
      <div className='flex justify-between items-center mb-8'>
        <h1 className="text-2xl font-bold">Verificar veículos não autorizados</h1>
        <button onClick={() => navigate('/check')}>
          <FaPlus className='w-10 h-10' />
        </button>
      </div>
      <UnauthorizedCarsTable />
    </ProtectedLayout>
  );
};

export default CheckUnauthorized;