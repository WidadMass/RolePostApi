const Joi = require('joi');
const mongoose = require('mongoose');

// Schéma Joi pour valider les données de la requête HTTP
// On crée un schéma qui inclut TOUS les champs potentiels,
// puis on utilise .when('type', ...) pour gérer la validation conditionnelle.
const validateRequestSchema = Joi.object({
  // Type de demande
  type: Joi.string()
    .valid('Congé', 'Note de Frais', 'Incident', 'Autre Demande')
    .required()
    .messages({
      'any.only': 'Le type de demande doit être parmi : Congé, Note de Frais, Incident, Autre Demande.',
      'any.required': 'Le type de demande est obligatoire.',
    }),


  // Description générale 
  description: Joi.string().allow('').optional(),

  // Champs communs
  service: Joi.string().allow('').optional(), // autoriser un service optionnel

  // Date de début (exigée si type = Congé 
  startDate: Joi.date().iso().when('type', {
    is: Joi.valid('Congé'),
    then: Joi.required().messages({
      'date.base': 'La date de début doit être une date valide.',
      'any.required': 'La date de début est obligatoire pour Congé ou ',
    }),
    otherwise: Joi.optional(),
  }),

  // Date de fin
  endDate: Joi.date()
    .iso()
    .greater(Joi.ref('startDate'))
    .allow(null)
    .messages({
      'date.base': 'La date de fin doit être une date valide.',
      'date.greater': 'La date de fin doit être postérieure à la date de début.',
    }),

  // ---- Champs spécifiques Congé ----
  natureConge: Joi.string().when('type', {
    is: 'Congé',
    then: Joi.required().messages({
      'any.required': 'La nature du congé est obligatoire pour un type "Congé".',
    }),
    otherwise: Joi.forbidden(), // Interdit si pas Congé
  }),

  // ---- Champs spécifiques Note de Frais ----
  periodeFrais: Joi.string().when('type', {
    is: 'Note de Frais',
    then: Joi.required().messages({
      'any.required': 'La période des frais est obligatoire pour une Note de Frais.',
    }),
    otherwise: Joi.forbidden(),
  }),
  montantFrais: Joi.number().when('type', {
    is: 'Note de Frais',
    then: Joi.required().messages({
      'any.required': 'Le montant est obligatoire pour une Note de Frais.',
    }),
    otherwise: Joi.forbidden(),
  }),

  // ---- Champs spécifiques Incident ----
  incidentDescription: Joi.string().when('type', {
    is: 'Incident',
    then: Joi.required().messages({
      'any.required': 'La description de l’incident est obligatoire.',
    }),
    otherwise: Joi.forbidden(),
  }),

  // Fichiers (optionnels) : ex si single('file'), tu as req.file
  // Mais si tu utilises upload.array('files'), req.files => un tableau
  // Ici, on part du principe que c’est un tableau (upload.array).
  files: Joi.array().items(
    Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string().valid('application/pdf',
        'image/jpeg',
        'image/png',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel'       // .xls
      ).required()
        .messages({
          'any.only': 'Le type de fichier doit être PDF, JPEG, PNG, XLS ou XLSX.',
        }),
      size: Joi.number().max(5 * 1024 * 1024).messages({
        'number.max': 'La taille du fichier ne doit pas dépasser 5 Mo.',
      }),
    }).unknown(true)
  ).optional(),
});

const validateRequest = (req, res, next) => {
  // Comme on utilise single('file'), on a req.file et non req.files
  // On convertit en tableau pour la validation
  if (req.file) {
    req.body.files = [req.file];
  } else {
    req.body.files = [];
  }

  const { error } = validateRequestSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation échouée.',
      details: error.details.map((err) => err.message),
    });
  }

  next();
};
// Middleware Mongoose : Générer un requestId unique avant d'enregistrer une demande
const addRequestIdMiddleware = (schema) => {
  schema.pre('save', async function (next) {
    if (!this.requestId) {
      const count = await mongoose.models.Request.countDocuments();
      this.requestId = `REQ-${count + 1}`;
    }
    next();
  });
};

module.exports = {
  validateRequest,
  addRequestIdMiddleware,
};
