import React, { useEffect, useState } from 'react';
import { fetchCheckPlateExists } from './fetchCheckPlate';
import { motion } from 'framer-motion';




const NewPlate: React.FC = () => {
    const [plateExists, setPlateExists] = useState<boolean | null>(null);
    const newPlate = "SVU-2G24"; // placa exemplo
    const [triggerAnimation, setTriggerAnimation] = useState(false);

    useEffect(() => {
        console.log("Verificando a placa:", newPlate);
        const checkPlate = async () => {
            const exists = await fetchCheckPlateExists(newPlate);
            setPlateExists(exists);

        };

        checkPlate();
    }, []);

    useEffect(() => {
        if (plateExists === false) {
            setTriggerAnimation(true);
            const timer = setTimeout(() => setTriggerAnimation(false), 1000); // animação por 1 segundo
            return () => clearTimeout(timer);
        }
    }, [plateExists]);

    const shakeVariant = {
        shake: {
            x: [-5, 5, -5, 5, -5, 5, -5, 5, 0],
            transition: { duration: 1 },
        },
    };

    return (
        <motion.div className="absolute bottom-0 left-0 w-1/2 h-2/5 bg-white flex flex-col justify-evenly" 
        variants={shakeVariant}
        animate={triggerAnimation ? 'shake' : ''}>
            <div className='bg-blue-600 w-full h-1/6 border-t-2 border-l-2 border-r-2 border-black items-center flex justify-center text-[white] font-bold'>
                <h3>Instituto Mauá de Tecnologia</h3>
            </div>

            <div className="h-2/3 w-full flex justify-center items-center border-2 border-black">
                <h1 className="text-[black] text-[100px] font-bold">{newPlate}</h1>
            </div>

            <div
                className={`w-full h-1/3 flex justify-center items-center text-[black] text-[48px] font-bold ${
                    plateExists ? 'bg-green-400' : 'bg-red-400'
                }`}
                
            >
                {plateExists ? `Cadastrada` : `Não Cadastrada`}
            </div>
        </motion.div>
    );
};

export default NewPlate;
