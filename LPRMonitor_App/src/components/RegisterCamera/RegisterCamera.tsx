import React, { useState } from 'react';
import ProtectedLayout from '../ProtectedLayout';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import useToast from '../../hooks/useToast';
import { Button, CircularProgress } from '@mui/material';
import { handleUnauthorized } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';

const RegisterCamera: React.FC = () => {
    const [cameraIp, setCameraIp] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // try {
        //     // Replace with your actual API endpoint and payload
        //     await axios.post('/api/cameras', {
        //         ip: cameraIp,
        //         description,
        //     });

        //     toast.success('Câmera registrada com sucesso!');
        //     setCameraIp('');
        //     setDescription('');
        // } catch (error: any) {
        //     if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        //         handleUnauthorized(error, navigate);
        //     }
        //     toast.error('Erro ao registrar câmera.');
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <ProtectedLayout onLogout={logout}>
            <form
                onSubmit={handleSubmit}
                className="w-auto mx-auto mt-10 p-6 rounded-2xl"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">Registrar Câmera</h2>

                <div className="mb-4 shadow-md bg-white rounded-md p-4">
                    <label className="block text-gray-700 mb-1">IP da Câmera *</label>
                    <input
                        type="text"
                        value={cameraIp}
                        onChange={(e) => setCameraIp(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#272932]"
                    />
                </div>

                <div className="mb-4 shadow-md bg-white rounded-md p-4">
                    <label className="block text-gray-700 mb-1">Descrição *</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#272932]"
                    />
                </div>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                        mt: 3,
                        py: 1.5,
                        backgroundColor: '#272932',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#4c5061' },
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar Câmera'}
                </Button>
            </form>
        </ProtectedLayout>
    );
};

export default RegisterCamera;
