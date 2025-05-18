import axios from 'axios';

const API_URL = 'http://localhost:5000/auth/login';
interface LoginCredentials {
    name: string;
    password: string;
}

export const postLogin = async (name: string, password: string) => {
    const credentials: LoginCredentials = {
        name,
        password,
    };
    try {
        const response = await axios.post(API_URL, credentials);
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};