import axios from 'axios';

const API_URL = 'http://localhost:5000/check_plate/get_last_plates';
const API_URL_2 = 'http://localhost:5000/check_plate/get_last_plate';

export const fetchLastUnauthorizedCars = async () => {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching unauthorized cars:', error);
        throw error;
    }
};

export const fetchLastUnauthorizedCar = async () => {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(API_URL_2, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching unauthorized cars:', error);
        throw error;
    }
};