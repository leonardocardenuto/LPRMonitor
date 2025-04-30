import React from 'react';
import NavBar from './components/NavBar';


const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <main className="p-4">Conteúdo principal</main>
    </>
  );
};

export default App;
