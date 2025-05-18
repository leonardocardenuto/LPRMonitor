import React from 'react';
import ProtectedLayout from './ProtectedLayout';
import { useAuth } from '../contexts/AuthContext';

import Camera from './HomeContainers/Camera';
import NewPlate from './HomeContainers/NewPlate/NewPlate';
import LastCars from './HomeContainers/LastCars/LastCars';
import UnauthorizedCarsTable from './HomeContainers/UnauthorizedCars/UnauthorizedCars';

const Home: React.FC = () => {
  const { logout } = useAuth();

  return (
    <ProtectedLayout onLogout={logout}>
      <Camera />
      <LastCars />
      <NewPlate />
      <UnauthorizedCarsTable className="bottom-0 right-0 absolute w-5/12 h-2/5" />
    </ProtectedLayout>
  );
};

export default Home;