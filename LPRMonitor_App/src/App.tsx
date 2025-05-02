import React from 'react';
import NavBar from './components/NavBar';
import Camera from './components/containers/Camera';
import NewPlateProps from './components/containers/NewPlate';


const App: React.FC = () => {
  return (
    // comentar
    <div className="flex h-screen">
      {/* Div que esta colocando tudo em linha para a NavBar ficar a esquerda da tela */}
      <NavBar />
      <div className="flex-1 m-6 bg-black relative border-4 border-blue-600">
        {/* Div do container que vai os 4 quadrados personalizaveis*/}

          <div className="flex justify-between h-1/2">
            <div>
              <Camera />
            </div>
            <div className="bg-white text-[black] p-6 w-1/3">
              SALVE
            </div>
          </div>

          <div className="flex justify-between h-1/3 bottom-0">
            <div>
              <NewPlateProps />
            </div>
            <div className="bg-white text-[black] p-6 w-1/3">
              nao salve
            </div>
          </div>


      {/* Div do container que vai os 4 quadrados personalizaveis*/}
      </div>
    </div>

  );
};

export default App;
