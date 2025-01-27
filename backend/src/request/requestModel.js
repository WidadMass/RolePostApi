const mongoose = require('mongoose');

// Schéma de la demande
const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Référence à l'utilisateur qui fait la demande
  },

  // Type de la demande
  type: {
    type: String,
    enum: ['Congé', 'Note de Frais', 'Incident', 'Autre Demande'],
    required: true,
  },

  // Pour tous les types : on peut avoir un "service" (optionnel)
  service: { 
    type: String, 
    // Par exemple : "Technique", "Commercial", "Administrateur", etc.
  },

  // Dates communes (si besoin)
  startDate: {
    type: Date,
    required: function () {
      return this.type === 'Congé' ;
    },
  },
  endDate: {
    type: Date,
  },

  // Statut de la demande (initialisé à Pending)
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },

  // Champs spécifiques pour Congé
  natureConge: {
    type: String, 
    // ex. "Annuel", "Repos compensateur", "Récupération", etc.
  },

  // Champs spécifiques pour Note de Frais
  periodeFrais: {
    type: String, 
    // ex. "02/2025" ou "février 2025"
  },
  montantFrais: {
    type: Number, 
    // ex. 150.5
  },

  // Champs spécifiques pour Incident

  incidentDescription: {
    type: String,
  },

  // Description générale (si tu en as besoin)
  description: {
    type: String, 
    // ex. champ commun "Description" saisi sur le frontend
  },

  // Fichiers liés à la demande
  files: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'File' }
  ],

  // Date de création
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Identifiant interne custom
  requestId: {
    type: String,
    unique: true,
  },
});

// Middleware pour générer un requestId unique avant d'enregistrer une demande
requestSchema.pre('save', async function (next) {
  if (!this.requestId) {
    const count = await mongoose.models.Request.countDocuments();
    this.requestId = `REQ-${count + 1}`;
  }
  next();
});

// Créer et exporter le modèle
module.exports = mongoose.model('Request', requestSchema);
