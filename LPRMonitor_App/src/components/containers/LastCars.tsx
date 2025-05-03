import React from 'react';

interface LastCarsProps {
    imageSrc?: string;
    altText?: string;
}

const LastCars: React.FC<LastCarsProps> = ({ imageSrc, altText = 'Camera feed' }) => {
    return (
        <div className="absolute top-0 right-0 w-5/12 h-1/2 bg-white flex justify-center items-center">
            {imageSrc ? (
                <img src={imageSrc} alt={altText} className="max-w-full max-h-full" />
            ) : (
                <p className="text-[16px] text-[#888]">No image available</p>
            )}
        </div>
    );
};

export default LastCars;
