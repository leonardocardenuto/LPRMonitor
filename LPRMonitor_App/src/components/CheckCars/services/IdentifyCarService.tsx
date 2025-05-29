import axios from 'axios';

const API_URL = 'http://localhost:5000/identify_car/create';

export const postIdentifyCar = async (data: {
  license_plate: string;
  status: string;
  extra_info: string | null;
  expire_date: string; 
  justification: string;
}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao identificar carro:', error);
    throw error;
  }
};
