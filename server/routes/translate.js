const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/translate', async (req, res) => {
    try {
        const { text } = req.body;
        
        console.log('\n=== Nouvelle requête de traduction ===');
        console.log('📝 Texte reçu:', text);
        
        if (!text) {
            console.log('❌ Erreur: Texte manquant');
            return res.status(400).json({
                success: false,
                message: 'Le texte à traduire est requis'
            });
        }

        // Première tentative avec l'API RTS
        try {
            const apiUrl = process.env.API_URL;
            const apiToken = process.env.API_TOKEN;
            
            console.log('🌐 Tentative avec l\'API RTS...');
            console.log('URL:', apiUrl);
            console.log('Headers:', {
                'Authorization': apiToken,
                'Content-Type': 'application/json; charset=utf-8'
            });
            console.log('Body:', {
                text: text,
                to: 'en'
            });

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': apiToken,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({ 
                    to: 'en', 
                    text: text 
                })
            });

            console.log('Status:', response.status);
            const data = await response.json();
            console.log('Structure complète de la réponse:', JSON.stringify(data, null, 2));

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            // Extraire la traduction de l'objet result
            if (data.result && data.result.translation) {
                return res.json({
                    success: true,
                    translation: data.result.translation
                });
            } else {
                throw new Error('Format de réponse inattendu');
            }
        } catch (rtsError) {
            console.log('⚠️ Échec de l\'API RTS:', rtsError.message);
            
            // Deuxième tentative avec l'API de secours
            const fallbackUrl = process.env.FALLBACK_API_URL;
            const params = new URLSearchParams({
                q: text,
                langpair: 'fr|en'
            });

            console.log('🌐 Tentative avec l\'API de secours...');
            console.log('URL:', fallbackUrl);
            console.log('Paramètres:', params.toString());

            const fallbackResponse = await fetch(`${fallbackUrl}?${params}`);
            const fallbackData = await fallbackResponse.json();
            
            console.log('✅ Réponse reçue de l\'API de secours:', fallbackData);
            return res.json({
                success: true,
                translation: fallbackData.responseData.translatedText
            });
        }
    } catch (error) {
        console.error('\n❌ Erreur détaillée de traduction:', {
            message: error.message
        });
        
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la traduction',
            error: error.message
        });
    }
});

module.exports = router; 