import axios from 'axios';

// Use Vite environment variable. Define VITE_API_URL in frontend/.env or in Vercel.
const API_URL = import.meta.env.VITE_API_URL || (window && window.location && `${window.location.protocol}//${window.location.hostname}:4000/api`);

export default {
    submit: async (payload) => {
        try {
            const response = await axios.post(`${API_URL}/submit`, payload);
            return response.data;
        } catch (error) {
            console.error('Erreur connexion backend:', error);
            return { ok: false };
        }
    },
    getStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/stats`);
            return response.data;
        } catch (error) {
            console.warn('getStats failed', error && error.message);
            return null;
        }
    }
};
