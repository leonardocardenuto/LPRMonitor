import React from 'react';
import ProtectedLayout from '../components/ProtectedLayout';
import UnauthorizedCarsTable from './HomeContainers/UnauthorizedCars/UnauthorizedCars';

const CheckUnauthorized: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
  
  };

  return (
    <ProtectedLayout onLogout={handleLogout}>
      <h1 className="text-2xl font-bold mb-4">Veículos Não Autorizados</h1>
      <UnauthorizedCarsTable />
    </ProtectedLayout>
  );
};

export default CheckUnauthorized;
