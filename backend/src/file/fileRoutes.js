const express = require('express');
const router = express.Router();
const upload = require('./fileService'); // Middleware multer
const { uploadFile } = require('./fileController');

// Endpoint pour uploader un fichier
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
