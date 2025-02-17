const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./user/userRoutes');
const postRoutes = require('./post/postRoutes'); // Importer les routes pour les posts
const fileRoutes = require('../src/file/fileRoutes');
const multer = require('multer');
const app = express();
const path = require('path');
// Exemple : pour servir les fichiers depuis le dossier 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));


// Middleware global
app.use(cors());

// Middleware pour analyser les données JSON
app.use(bodyParser.json());

// Middleware pour analyser les données x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//  les routes utilisateur
app.use('/api/users', userRoutes);

//les routes pour les posts
app.use('/api/posts', postRoutes);


app.use('/api/files', fileRoutes);



module.exports = app;
