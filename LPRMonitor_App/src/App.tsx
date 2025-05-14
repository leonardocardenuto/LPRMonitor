import React from 'react';
import NavBar from './components/NavBar';
import Camera from './components/containers/Camera';
import NewPlateProps from './components/containers/NewPlate/NewPlate';
import LastCars from './components/containers/LastCars/LastCars';
import LPR_Monitor_logo from './assets/LPR_Monitor_logo.png';
import UnauthorizedCarsTable from './components/containers/UnauthorizedCars/UnauthorizedCars';


const App: React.FC = () => {
  return (
    // comentar
    <div className="flex h-screen bg-[#DEE5E5]">
      {/* Div que esta colocando tudo em linha para a NavBar ficar a esquerda da tela */}
      <NavBar />
      <div className="flex-1 m-8 relative">
        {/* Div do container que vai os 4 quadrados personalizaveis*/}
        <div>
          <Camera />
        </div>
        <div>
          <LastCars />
        </div>
        <div>
          <NewPlateProps />  
        </div>
        <div>
          <UnauthorizedCarsTable />
        </div>



      {/* Div do container que vai os 4 quadrados personalizaveis*/}
      </div>
    </div>

  );
};

export default App;
