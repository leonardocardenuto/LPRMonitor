import React from 'react';

interface NewPlateProps {
    imageSrc?: string;
    altText?: string;
}

const NewPlate: React.FC<NewPlateProps> = ({ imageSrc, altText = 'Camera feed' }) => {
    return (
        <div className="absolute w-1/2 h-1/3 bg-white flex justify-center items-center">
            {imageSrc ? (
                <img src={imageSrc} alt={altText} className="max-w-full max-h-full" />
            ) : (
                <p className="text-[16px] text-[#888]">No image available</p>
            )}
        </div>
    );
};

export default NewPlate;
