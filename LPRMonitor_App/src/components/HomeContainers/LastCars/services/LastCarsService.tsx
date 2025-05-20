import axios from 'axios';

const API_URL = 'http://localhost:5000/check_plate/get_last_plates'; 

export const fetchLastCars = async () => {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${API_URL}`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching last cars:', error);
        throw error;
    }
};