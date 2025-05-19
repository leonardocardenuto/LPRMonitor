import axios from 'axios';

const API_URL = 'http://localhost:5000/check_plate/check_plate'; // Endpoint da verificação de placa

interface PlateCheckResponse {
  plate: string;
  exists: boolean;
}

export const fetchCheckPlateExists = async (): Promise<PlateCheckResponse | null> => {
  try {
    const response = await axios.post(API_URL);
    return response.data; // onde `data` contém { plate, exists }
  } catch (error: any) {
    console.error('Erro na verificação da placa:', error.response?.data?.error || error.message);
    return null;
  }
};




