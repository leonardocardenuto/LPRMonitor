import React, { useEffect, useState } from 'react';
import { fetchCheckPlateExists } from './fetchCheckPlate';
import { motion } from 'framer-motion';
import { handleUnauthorized } from '../../../utils/authUtils';
import { useNavigate } from 'react-router-dom';


interface UnauthorizedCar {
  newPlate: string;
  time: string;
  description: string;
}

interface NewPlateProps {
  updateTrigger?: number; 
}

const NewPlate: React.FC<NewPlateProps> = ({ updateTrigger }) => {
    const [plateExists, setPlateExists] = useState<boolean | null>(null);
    const [triggerAnimation, setTriggerAnimation] = useState(false);
    const [newPlate, setNewPlate] = useState<string | null>(null);
    const navigate = useNavigate();


    useEffect(() => {

        const checkPlate = async () => {
            try {
                const response = await fetchCheckPlateExists();
                console.log(response);
                if (response && response.plate !== undefined) {
                    setNewPlate(response.plate);
                    setPlateExists(response.exists);
                } else {
                    setNewPlate(null);
                    setPlateExists(false);
                }

            } catch (error) {
                if (error instanceof Error && (error as any).response && (error as any).response.status === 401) {
                    handleUnauthorized(error, navigate);
                }                
                setNewPlate(null);
                setPlateExists(false);
            }
        };

        checkPlate();
    }, [updateTrigger]);

    useEffect(() => {
        if (plateExists === false) {
            setTriggerAnimation(true);
            const timer = setTimeout(() => setTriggerAnimation(false), 1000);
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
        <motion.div
          className="absolute bottom-0 left-0 w-1/2 h-2/5 rounded-2xl bg-white flex flex-col justify-evenly"
          variants={shakeVariant}
          animate={triggerAnimation ? 'shake' : ''}
        >
            <div className='bg-blue-600 w-full h-1/6 border-t-2 rounded-t-2xl border-l-2 border-r-2 border-black items-center flex justify-center text-[white] font-bold'>
                <h3>Instituto Mauá de Tecnologia</h3>
            </div>

            <div className="h-2/3 w-full flex justify-center items-center border-2 border-black">
                <h1 className="text-[black] text-[100px] font-bold">{newPlate}</h1>
            </div>

            <div
                className={`w-full h-1/3 flex justify-center items-center rounded-b-2xl text-[black] text-[48px] font-bold ${
                    plateExists ? 'bg-green-400' : 'bg-red-400'
                }`}
            >
                {plateExists ? `Cadastrada` : `Não Cadastrada`}
            </div>
        </motion.div>
    );
};

export default NewPlate;