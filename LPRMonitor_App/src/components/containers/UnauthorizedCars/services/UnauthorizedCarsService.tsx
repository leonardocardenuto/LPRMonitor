import axios from 'axios';

const API_URL = 'http://localhost:5000/check_plate/get_last_plates'; // Replace with your actual endpoint

export const fetchLastUnauthorizedCars = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching unauthorized cars:', error);
        throw error;
    }
};