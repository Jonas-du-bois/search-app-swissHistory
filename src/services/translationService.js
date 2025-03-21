import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const translateText = async (text) => {
    try {
        if (!text.trim()) return '';
        
        console.log('🔄 Service de traduction - Texte à traduire:', text);
        
        // Si le texte est déjà en anglais, pas besoin de le traduire
        if (isEnglish(text)) {
            console.log('ℹ️ Texte déjà en anglais, pas de traduction nécessaire');
            return text;
        }
        
        console.log('📤 Envoi de la requête de traduction au serveur...');
        const response = await axios.post(`${API_URL}/api/translate`, { text });
        console.log('✅ Traduction reçue:', response.data.translation);
        
        return response.data.translation;
    } catch (error) {
        console.error('❌ Erreur dans le service de traduction:', {
            message: error.message,
            response: error.response?.data
        });
        
        if (error.message === 'Network Error') {
            throw new Error('Impossible de se connecter au serveur de traduction. Assurez-vous que le serveur backend est en cours d\'exécution.');
        }
        
        throw new Error('Impossible de traduire le texte. Veuillez réessayer.');
    }
};

// Fonction basique pour détecter si le texte est probablement en anglais
function isEnglish(text) {
    // Liste de mots courants en anglais
    const englishWords = ['the', 'and', 'is', 'in', 'to', 'a', 'of', 'that', 'for', 'it'];
    const words = text.toLowerCase().split(/\s+/);
    
    // Si plus de 50% des mots sont dans la liste, on considère que c'est de l'anglais
    const englishWordCount = words.filter(word => englishWords.includes(word)).length;
    return englishWordCount / words.length > 0.5;
}