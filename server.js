const app = require('./backend/src/app'); // Charger Express
const connectDB = require('./backend/src/config/db'); // Charger MongoDB

// Charger les variables d'environnement
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB();

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

