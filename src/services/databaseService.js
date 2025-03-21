import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const searchDatabase = async (query, translatedQuery) => {
    try {
        // Attendre la traduction avant de lancer la recherche
        const response = await axios.get(`${API_URL}/api/search`, {
            params: {
                query,
                translatedQuery
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        throw error;
    }
};
