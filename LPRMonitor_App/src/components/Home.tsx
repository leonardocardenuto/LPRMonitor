import React from 'react';
import ProtectedLayout from '../components/ProtectedLayout';

import Camera from './HomeContainers/Camera';
import NewPlate from './HomeContainers/NewPlate/NewPlate';
import LastCars from './HomeContainers/LastCars/LastCars';
import UnauthorizedCarsTable from './HomeContainers/UnauthorizedCars/UnauthorizedCars';

interface HomeProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Home: React.FC<HomeProps> = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <ProtectedLayout onLogout={handleLogout}>
      <Camera />
      <LastCars />
      <NewPlate />
      <UnauthorizedCarsTable className='bottom-0 right-0 absolute w-5/12 h-2/5' />
    </ProtectedLayout>
  );
};

export default Home;
