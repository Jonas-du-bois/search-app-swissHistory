const fs = require('fs');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const importData = async () => {
    try {
        console.log('Début de l\'importation...');
        
        // Lire le fichier JSON avec le bon chemin
        const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json'), 'utf8'));
        console.log('Données JSON lues avec succès:', jsonData);
        
        // Envoyer les données au serveur
        console.log('Envoi des données au serveur...');
        const response = await axios.post('http://localhost:5000/api/import', jsonData.items);
        
        console.log('Import réussi :', response.data);
    } catch (error) {
        console.error('Erreur détaillée lors de l\'import :', error.message);
        if (error.response) {
            console.error('Réponse du serveur:', error.response.data);
        }
    }
};

// Exécuter l'import
importData(); 