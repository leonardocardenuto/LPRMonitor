import React from 'react';
import NavBar from './components/NavBar';
import Camera from './components/containers/Camera';


const App: React.FC = () => {
  return (
    <>
    <div className="flex h-screen">
      <NavBar />
      <div className="flex-1 m-6 bg-black relative border-4 border-blue-600">
        <div className="flex justify-between">
          <Camera />
          <div className="bg-white text-[#0000] h-1/2">SALVE</div>

        </div>
      </div>
    </div>
    </>
  );
};

export default App;
