import axios from 'axios';

const API_URL = 'http://localhost:5000/check_plate/check_plate'; // Endpoint da verificação de placa

export const fetchCheckPlateExists = async (plateId: string): Promise<boolean> => {
    try {
        const response = await axios.post(API_URL, { plate_id: plateId });
        return response.data.exists;
    } catch (error: any) {
        console.error('Erro na verificação da placa:', error.response?.data?.error || error.message);
        return false;
    }
};

