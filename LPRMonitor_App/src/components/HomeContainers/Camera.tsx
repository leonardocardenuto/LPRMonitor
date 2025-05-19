import React, { useState } from 'react';

const Camera: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const ipCam = import.meta.env.VITE_IP_CAM;

  if (!ipCam) {
    console.warn('VITE_IP_CAM não foi definida. Verifique seu arquivo .env.');
  }
  
  return (
    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white flex justify-center items-center rounded-2xl">
      {error ? (
      <p className="text-[16px] text-[#888]">{error}</p>
      ) : (
      <img
        src={`http://${ipCam}/video`}
        alt="IP Webcam Stream"
        className="w-full h-full object-cover rounded-2xl"
        onError={() => setError('Não foi possível carregar a câmera.')}
      />
      )}
    </div>
  );
};

export default Camera;