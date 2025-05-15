import React from 'react';
import NavBar from './NavBar';
import Camera from './containers/Camera';
import UnauthorizedCarsTable from './containers/UnauthorizedCars/UnauthorizedCars';
import NewPlate from './containers/NewPlate/NewPlate';
import LastCars from './containers/LastCars/LastCars';


interface HomeProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Home: React.FC<HomeProps> = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="flex h-screen bg-[#DEE5E5]">
      <NavBar onLogout={handleLogout} />
      <div className="flex-1 m-8 relative">
        <div><Camera /></div>
        <div><LastCars /></div>
        <div><NewPlate /></div>
        <div><UnauthorizedCarsTable /></div>
      </div>
    </div>
  );
};

export default Home;
