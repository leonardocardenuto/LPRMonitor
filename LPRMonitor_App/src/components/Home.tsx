import React, { useEffect, useState } from 'react';
import ProtectedLayout from './ProtectedLayout';
import { useAuth } from '../contexts/AuthContext';

import Camera from './HomeContainers/Camera';
import NewPlate from './HomeContainers/NewPlate/NewPlate';
import LastCars from './HomeContainers/LastCars/LastCars';
import UnauthorizedCarsTable from './HomeContainers/UnauthorizedCars/UnauthorizedCars';

const Home: React.FC = () => {
  const { logout } = useAuth();

  // State to trigger reloads of components
  const [updateCounter, setUpdateCounter] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const evtSource = new EventSource(`http://localhost:5000/stream?token=${token}`);
    
    evtSource.onmessage = (event) => {
      console.log('SSE message received:', event.data);
      // Increment updateCounter to trigger re-fetch or re-render
      setUpdateCounter((prev) => prev + 1);
    };

    evtSource.onerror = () => {
      console.error('EventSource failed.');
      evtSource.close();
    };

    return () => {
      evtSource.close();
    };
  }, []);

  return (
    <ProtectedLayout onLogout={logout}>
      <Camera />
      <LastCars updateTrigger={updateCounter} />
      <NewPlate updateTrigger={updateCounter} />
      <UnauthorizedCarsTable
        updateTrigger={updateCounter}
        className="bottom-0 right-0 absolute w-5/12 h-2/5"
      />
    </ProtectedLayout>
  );
};

export default Home;