import React, { useState } from 'react';
import brasil from '../../assets/brasil.png';



const NewPlate: React.FC = () => {
    {/* Adicionar requisição de leitura de nova Placa*/}
    const [newPlate] = React.useState<string>('SVU-2G24');
    const [cadastrada] = useState<boolean>(false);

    return (
        <div className="absolute bottom-0 left-0 w-1/2 h-2/5 bg-white flex flex-col justify-evenly">
            <div className='bg-blue-600 w-full h-1/6 border-t-2 border-l-2 border-r-2 border-black items-center flex justify-center text-[white] font-bold'>

                <h3>Instituto Mauá de Tecnologia</h3>
            </div>
            <div className="h-2/3 w-full flex justify-center items-center border-2 border-black">   
                <h1 className="text-[black] text-[100px] font-bold">{newPlate}</h1>
            </div>
            <div className={`w-full h-1/3 flex justify-center items-center text-[black] text-[48px] font-bold ${cadastrada? `bg-green-400` : `bg-red-400 `}`}>  
                {cadastrada ? `Cadastrada` : `Não Cadastrada`}
            </div>
        </div>
    );
};

export default NewPlate;
