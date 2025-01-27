const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: { type: String, required: true },
    filePath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true }, // Référence à une demande
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }      // Référence à un utilisateur
});

module.exports = mongoose.model('File', fileSchema);
