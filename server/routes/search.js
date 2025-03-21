const express = require('express');
const router = express.Router();
const Data = require('../models/Data');

// Route pour la recherche
router.get('/search', async (req, res) => {
    try {
        const { query, translatedQuery } = req.query;
        
        if (!query || !translatedQuery) {
            return res.status(400).json({
                success: false,
                message: 'La requête et sa traduction sont requises'
            });
        }

        console.log('🔍 Recherche avec la traduction:', translatedQuery);

        // Création d'une expression régulière pour la recherche insensible à la casse
        const translatedRegex = new RegExp(translatedQuery, 'i');

        // Recherche uniquement dans les champs traduits en anglais
        const results = await Data.find({
            $or: [
                { 'content.title_eng': translatedRegex },
                { 'content.description_eng': translatedRegex }
            ]
        })
        .select('content') // On ne sélectionne que le champ content
        .lean() // On convertit en objet JavaScript simple
        .limit(20); // Limite les résultats à 20 documents

        // Suppression des doublons basée sur le document_url
        const uniqueResults = results.reduce((acc, current) => {
            const exists = acc.find(item => item.document_url === current.document_url);
            if (!exists) {
                acc.push(current);
            }
            return acc;
        }, []);

        console.log('📊 Nombre de résultats uniques trouvés:', uniqueResults.length);

        res.json({
            success: true,
            count: uniqueResults.length,
            results: uniqueResults
        });
    } catch (error) {
        console.error('❌ Erreur lors de la recherche:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche',
            error: error.message
        });
    }
});

module.exports = router; 