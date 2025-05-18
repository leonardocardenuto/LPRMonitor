import React from 'react';
import ProtectedLayout from '../ProtectedLayout';
import UnauthorizedCarsTable from '../HomeContainers/UnauthorizedCars/UnauthorizedCars';
import { FaAd, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Props {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckUnauthorized: React.FC<Props> = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };
  const navigate = useNavigate();

  return (
    <ProtectedLayout onLogout={handleLogout}>
      <div className='flex justify-between items-center mb-8'>
        <h1 className="text-2xl font-bold">Verificar veículos não autorizados</h1>
        <button onClick={() => navigate('/check')}><FaPlus className='w-10 h-10'></FaPlus></button>
      </div>

      <UnauthorizedCarsTable />
    </ProtectedLayout>
  );
}; 

export default CheckUnauthorized;
