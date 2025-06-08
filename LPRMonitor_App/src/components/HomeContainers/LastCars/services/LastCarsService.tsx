import axios from 'axios';

const API_URL_fetch_cars = 'http://localhost:5000/check_plate/get_last_plates'; 
const API_URL_list_cameras = 'http://localhost:5000/yolo/list-all-cameras'

export const fetchLastCars = async () => {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${API_URL_fetch_cars}`, {
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

export const listAllCameras = async () => {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${API_URL_list_cameras}`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cameras:', error);
        throw error;
    }
};