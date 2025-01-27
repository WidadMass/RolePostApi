const mongoose = require('mongoose');

// Définir le schéma de l'utilisateur
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {
    type: String,
    default: null, // Par défaut, null si le champ n'est pas fourni
    validate: {
      validator: function (v) {
        // Valide si le champ est absent ou correspond au format
        return !v || /^(\+?\d{1,3}[- ]?)?\d{10}$/.test(v);
      },
      message: props => `${props.value} n'est pas un numéro de téléphone valide.`,
    },
  },
  role: { type: String, enum: ['EMPLOYEE', 'MANAGER', 'ADMIN'], default: 'EMPLOYEE' },
  service: {
    type: String,
    enum: ['Technique', 'Commercial', 'Administration'], // Limite les valeurs possibles
    required: true, // Le champ est obligatoire
  },
  isActive: { type: Boolean, default: true }, // Champ pour le statut actif/inactif
  createdAt: { type: Date, default: Date.now },
});

// Exporter le modèle User
module.exports = mongoose.model('User', userSchema);
