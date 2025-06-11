import axios from 'axios';

const API_URL_fetch_cars = 'http://localhost:5000/check_plate/get_last_plates'; 
const API_URL_list_cameras = 'http://localhost:5000/yolo/list-all-cameras'
const API_URL_fetch_unverified_cars = 'http://localhost:5000/check_plate/unverified_plates'
const API_URL_fetch_registered_cars = 'http://localhost:5000/check_plate/registered_plates'

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
        console.error('Error fetching unverified cars:', error);
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

export const fetchRegiteredCars = async () => {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${API_URL_fetch_registered_cars}`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching registered cars:', error);
        throw error;
    }
};