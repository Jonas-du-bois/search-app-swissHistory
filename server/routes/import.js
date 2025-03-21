const express = require('express');
const router = express.Router();
const Data = require('../models/Data');

// Route pour importer des données JSON
router.post('/import', async (req, res) => {
    try {
        const jsonData = req.body;
        
        // Si c'est un tableau, importez plusieurs documents
        if (Array.isArray(jsonData)) {
            const documents = jsonData.map(item => ({
                content: item
            }));
            const result = await Data.insertMany(documents);
            res.json({
                success: true,
                message: `${result.length} documents importés avec succès`,
                data: result
            });
        } else {
            // Si c'est un objet unique, créez un seul document
            const newData = new Data({
                content: jsonData
            });
            const result = await newData.save();
            res.json({
                success: true,
                message: 'Document importé avec succès',
                data: result
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'importation des données',
            error: error.message
        });
    }
});

// Route pour récupérer toutes les données
router.get('/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des données',
            error: error.message
        });
    }
});

module.exports = router; 