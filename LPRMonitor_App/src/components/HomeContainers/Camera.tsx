import React, { useEffect, useRef, useState } from 'react';

const Camera: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startDroidCam = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInput = devices.find(
                    (device) => device.kind === 'videoinput' && device.label.toLowerCase().includes('droidcam')
                );

                if (!videoInput) {
                    setError('Não foi possível conectar a câmera. Verifique se ela está ativa.');
                    return;
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: videoInput.deviceId }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setError('Unable to access DroidCam');
                console.error(err);
            }
        };

        startDroidCam();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white flex justify-center items-center rounded-2xl">
            {error ? (
                <p className="text-[16px] text-[#888]">{error}</p>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover rounded-2xl"
                />
            )}
        </div>
    );
};

export default Camera;
