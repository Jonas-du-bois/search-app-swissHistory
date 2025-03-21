const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    // Schéma flexible qui accepte n'importe quelle structure
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Permet d'ajouter des champs dynamiques
    strict: false
});

module.exports = mongoose.model('Data', DataSchema); 