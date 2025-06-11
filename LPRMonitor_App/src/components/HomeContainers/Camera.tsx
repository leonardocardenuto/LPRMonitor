import React, { useState, useEffect } from 'react';
import { getAllCameras } from '../RegisterCamera/services/CameraService';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Camera: React.FC = () => {
  const [cameras, setCameras] = useState<{ id: string; camera_ip: string; place: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await getAllCameras();
        setCameras(Array.isArray(response.cameras) ? response.cameras : []);
        setLoading(false);
      } catch {
        setError('Erro ao buscar câmeras.');
        setLoading(false);
      }
    };
    fetchCameras();
  }, []);

  const handlePrev = () => {
    setError(null);
    setCurrentIndex((prev) => (prev === 0 ? cameras.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setError(null);
    setCurrentIndex((prev) => (prev === cameras.length - 1 ? 0 : prev + 1));
  };

  const currentCam = cameras[currentIndex];

  return (
    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white flex flex-col justify-center items-center rounded-2xl p-4 shadow-lg">
      {error ? (
        <p className="text-[16px] text-[#888]">{error}</p>
      ) : loading ? (
        <p className="text-[16px] text-[#888]">Carregando câmeras...</p>
      ) : cameras.length === 0 ? (
        <p className="text-[16px] text-[#888]">Não há câmeras ativas cadastradas.</p>
      ) : (
        <>
          <div className="relative w-full h-full">
            <img
              src={`http://${currentCam.camera_ip}:8080/video`}
              alt={`Câmera em ${currentCam.place}`}
              className="w-full h-full object-cover rounded-2xl"
              onError={() => setError('Não foi possível carregar a câmera.')}
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
              {currentCam.place}
            </div>
            <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
              <button onClick={handlePrev} className="text-white bg-black bg-opacity-50 rounded-full p-2">
                <ArrowBackIosIcon fontSize="small" />
              </button>
            </div>
            <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
              <button onClick={handleNext} className="text-white bg-black bg-opacity-50 rounded-full p-2">
                <ArrowForwardIosIcon fontSize="small" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Camera;