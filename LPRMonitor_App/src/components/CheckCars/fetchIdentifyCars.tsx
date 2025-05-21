import axios from 'axios';

const API_URL = 'http://localhost:5000/check_plate/unverified_plates'; // Endpoint de placas não verificadas

interface UnverifiedPlatesResponse {
  plates: string[]; // ou ajuste para o tipo correto caso retorne objetos
}

export const fetchUnverifiedPlates = async (): Promise<UnverifiedPlatesResponse | null> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // onde `data` contém { plates: [...] }
  } catch (error: any) {
    console.error('Erro ao buscar placas não verificadas:', error.response?.data?.error || error.message);
    return null;
  }
};

interface CarAuthorizationData {
  license_plate_id: string;
  valid_until: string; // formato ISO, ex: "2025-05-20T23:59:00"
  justification?: string;
  status?: string;
  extra_info?: string;
}

export const fetchCarAuthorization = async (data: CarAuthorizationData): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');

    await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return true;
  } catch (error: any) {
    console.error('Erro ao criar autorização:', error.response?.data || error.message);
    return false;
  }
};