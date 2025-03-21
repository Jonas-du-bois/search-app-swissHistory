const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('Tentative de connexion à MongoDB...');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/searchapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB avec succès'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
const importRoutes = require('./routes/import');
const searchRoutes = require('./routes/search');
const translateRoutes = require('./routes/translate');

app.use('/api', importRoutes);
app.use('/api', searchRoutes);
app.use('/api', translateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
}); 