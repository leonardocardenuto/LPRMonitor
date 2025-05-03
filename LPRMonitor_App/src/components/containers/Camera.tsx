import React from 'react';

interface CameraProps {
    imageSrc?: string;
    altText?: string;
}

const Camera: React.FC<CameraProps> = ({ imageSrc, altText = 'Camera feed' }) => {
    return (
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white flex justify-center items-center">
            {imageSrc ? (
                <img src={imageSrc} alt={altText} className="max-w-full max-h-full" />
            ) : (
                <p className="text-[16px] text-[#888]">No image available</p>
            )}
        </div>
    );
};

export default Camera;
