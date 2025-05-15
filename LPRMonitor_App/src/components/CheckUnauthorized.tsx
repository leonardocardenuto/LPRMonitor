import React from 'react';
import ProtectedLayout from '../components/ProtectedLayout';
import UnauthorizedCarsTable from './HomeContainers/UnauthorizedCars/UnauthorizedCars';

interface Props {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckUnauthorized: React.FC<Props> = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <ProtectedLayout onLogout={handleLogout}>
      <h1 className="text-2xl font-bold mb-4">Veículos Não Autorizados</h1>
      <UnauthorizedCarsTable />
    </ProtectedLayout>
  );
};

export default CheckUnauthorized;
