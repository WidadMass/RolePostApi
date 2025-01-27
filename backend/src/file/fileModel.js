const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: { type: String, required: true },
    filePath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'post', required: true }, // Référence à une post
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }      // Référence à un utilisateur
});

module.exports = mongoose.model('File', fileSchema);
