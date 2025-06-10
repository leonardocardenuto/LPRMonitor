import axios from 'axios';

const API_URL = 'http://localhost:5000/camera';
const YOLO_API_URL = 'http://localhost:5000/yolo';


export const createCamera = async (data: {
    camera_ip: string;
    place: string;
}) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/create`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar câmera:', error);
        throw error;
    }
};

export const updateCamera = async (
    camera_id: number,
    data: {
        camera_ip?: string;
        place?: string;
    }
) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${API_URL}/update/${camera_id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar câmera:', error);
        throw error;
    }
};

export const getAllCameras = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${YOLO_API_URL}/list-all-cameras`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar câmeras:', error);
        throw error;
    }
};