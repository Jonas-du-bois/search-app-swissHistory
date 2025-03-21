const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Modèle MongoDB
const DataSchema = new mongoose.Schema({
    content: mongoose.Schema.Types.Mixed
}, { strict: false });

const Data = mongoose.model('Data', DataSchema);

// Fonction d'importation
async function importData() {
    try {
        console.log('Démarrage de l\'importation...');
        
        console.log('Connexion à MongoDB...');
        await mongoose.connect('mongodb://127.0.0.1:27017/searchapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connecté à MongoDB');

        console.log('Lecture du fichier JSON...');
        const filePath = path.resolve(__dirname, '../data/data.json');
        console.log('Chemin du fichier:', filePath);
        
        if (!fs.existsSync(filePath)) {
            throw new Error(`Le fichier ${filePath} n'existe pas`);
        }
        
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log('Structure des données:', Object.keys(jsonData));

        console.log('Importation des données...');
        // Si les données sont déjà dans le bon format
        const dataToImport = Array.isArray(jsonData) ? jsonData : jsonData.items || [jsonData];
        const result = await Data.insertMany(dataToImport.map(item => ({ content: item })));
        console.log(`${result.length} documents importés avec succès`);

        await mongoose.connection.close();
        console.log('Connexion MongoDB fermée');
    } catch (error) {
        console.error('Erreur détaillée:', error);
        if (mongoose.connection) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

importData(); 