import React, { useState, useEffect } from 'react';
import ProtectedLayout from '../ProtectedLayout';
import { useAuth } from '../../contexts/AuthContext';
import useToast from '../../hooks/useToast';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createCamera, getAllCameras, updateCamera } from './services/CameraService';

const RegisterCamera: React.FC = () => {
    const [tab, setTab] = useState(0);
    const [cameraIp, setCameraIp] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(true);
    const [editCameraId, setEditCameraId] = useState('');
    const [editCameraIp, setEditCameraIp] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editActive, setEditActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [cameras, setCameras] = useState<{ id: string; camera_ip: string; place: string; active: boolean }[]>([]);
    const toast = useToast();
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const fetchCameras = async () => {
            try {
                const response = await getAllCameras(false);
                setCameras(Array.isArray(response.cameras) ? response.cameras : []);
            } catch {
                toast.error('Erro ao buscar câmeras');
            }
        };
        fetchCameras();
    }, []);

    const handleEditClick = (camera: { id: string; camera_ip: string; place: string; active?: boolean }) => {
        setEditCameraId(String(camera.id));
        setEditCameraIp(camera.camera_ip);
        setEditDescription(camera.place);
        setEditActive(camera.active ?? true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateCamera(Number(editCameraId), {
                camera_ip: editCameraIp,
                place: editDescription,
                active: editActive,
            });
            toast.success('Câmera atualizada com sucesso!');
            setEditCameraId('');
            setEditCameraIp('');
            setEditDescription('');
            setEditActive(true);
            const updated = await getAllCameras();
            setCameras(Array.isArray(updated.cameras) ? updated.cameras : []);
        } catch {
            toast.error('Erro ao atualizar câmera');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createCamera({ camera_ip: cameraIp, place: description, active: active });
            toast.success('Câmera registrada com sucesso!');
            setCameraIp('');
            setDescription('');
            setActive(true);
            const updated = await getAllCameras();
            setCameras(Array.isArray(updated.cameras) ? updated.cameras : []);
        } catch (error: any) {
            if (error.response && error.status == 409) {
                toast.error('Erro ao registrar: câmera ja registrada');
            } else {
                toast.error('Erro ao registrar câmera');
            }
        } finally {
            setLoading(false);
        }
    };

    const tabs = ['Adicionar Câmera', 'Editar Câmera'];

    return (
        <ProtectedLayout onLogout={logout}>
            <div className="w-full mt-4 flex justify-center">
                <div className="flex bg-zinc-100 p-1 rounded-xl shadow-inner">
                    {tabs.map((t, index) => (
                        <button
                            key={t}
                            onClick={() => setTab(index)}
                            className={`relative px-6 py-2 rounded-xl transition-all duration-300 ease-in-out text-sm font-medium
                                ${tab === index ? 'text-white bg-zinc-800 shadow-md' : 'text-zinc-600 hover:text-zinc-800'}
                            `}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {tab === 0 ? (
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <form onSubmit={handleRegisterSubmit} className="w-auto mx-auto mt-10 p-6 rounded-2xl">
                            <h2 className="text-2xl font-semibold mb-4 text-center">Registrar Câmera</h2>
                            <div className="mb-4 shadow-md bg-white rounded-md p-4">
                                <label className="block text-gray-700 mb-1">IP da Câmera *</label>
                                <input
                                    type="text"
                                    value={cameraIp}
                                    onChange={(e) => setCameraIp(e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="mb-4 shadow-md bg-white rounded-md p-4">
                                <label className="block text-gray-700 mb-1">Descrição *</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="mb-4 shadow-md bg-white rounded-md p-4">
                                <label className="block text-gray-700 mb-1">Ativo</label>
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                    className="mr-2"
                                    disabled
                                />
                                <span>{active ? 'Sim' : 'Não'}</span>
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
                    </motion.div>
                ) : (
                    <motion.div
                        key="edit"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-auto mx-auto mt-10 p-6 rounded-2xl">
                            <h2 className="text-2xl font-semibold mb-4 text-center">Editar Câmera</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Selecione uma câmera para editar:</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                                    value={editCameraId}
                                    onChange={(e) => {
                                        const cam = cameras.find(c => String(c.id) === e.target.value);
                                        if (cam) handleEditClick(cam);
                                        else {
                                            setEditCameraId('');
                                            setEditCameraIp('');
                                            setEditDescription('');
                                            setEditActive(true);
                                        }
                                    }}
                                >
                                    <option value="">Selecione...</option>
                                    {cameras.map(cam => (
                                        <option key={cam.id} value={cam.id}>
                                            {cam.place} ({cam.camera_ip}) {cam.active ? '(Ativa)' : '(Inativa)'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {editCameraId && (
                                <form onSubmit={handleEditSubmit}>
                                    <div className="mb-4 shadow-md bg-white rounded-md p-4">
                                        <label className="block text-gray-700 mb-1">IP da Câmera *</label>
                                        <input
                                            type="text"
                                            value={editCameraIp}
                                            onChange={(e) => setEditCameraIp(e.target.value)}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div className="mb-4 shadow-md bg-white rounded-md p-4">
                                        <label className="block text-gray-700 mb-1">Descrição *</label>
                                        <input
                                            type="text"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div className="mb-4 shadow-md bg-white rounded-md p-4">
                                        <label className="block text-gray-700 mb-1">Ativo</label>
                                        <input
                                            type="checkbox"
                                            checked={editActive}
                                            onChange={(e) => setEditActive(e.target.checked)}
                                            className="mr-2 focus:outline-none focus:ring-0"
                                        />
                                        <span>{editActive ? 'Sim' : 'Não'}</span>
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
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Alterações'}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ProtectedLayout>
    );
};

export default RegisterCamera;