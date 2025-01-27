const File = require('./fileModel');

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier envoyé.' });
        }

        // Enregistre les détails du fichier dans la base
        const newFile = new File({
            filename: req.file.filename,
            originalName: req.file.originalname,
            fileType: req.file.mimetype,
            filePath: req.file.path
        });

        await newFile.save();
        res.status(201).json({ message: 'Fichier uploadé avec succès.', file: newFile });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};

module.exports = { uploadFile };
