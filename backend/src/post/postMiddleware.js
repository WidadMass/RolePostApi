const Joi = require('joi');
const mongoose = require('mongoose');

// Schéma Joi pour valider les données d'un "post"
const validatePostSchema = Joi.object({
  // Titre du post (requis)
  title: Joi.string().required().messages({
    'string.empty': 'Le titre est obligatoire.',
    'any.required': 'Le titre est obligatoire.',
  }),

  // Contenu du post (requis)
  content: Joi.string().required().messages({
    'string.empty': 'Le contenu est obligatoire.',
    'any.required': 'Le contenu est obligatoire.',
  }),

  // Catégorie du post (requis)
  category: Joi.string()
    .valid('Article', 'Annonce', 'Mise à jour', 'Autre')
    .required()
    .messages({
      'any.only': 'La catégorie doit être parmi : Article, Annonce, Mise à jour, Autre.',
      'any.required': 'La catégorie est obligatoire.',
    }),

  // Tags optionnels pour le post
  tags: Joi.array().items(Joi.string()).optional(),

  // Fichiers (optionnels)
  files: Joi.array()
    .items(
      Joi.object({
        originalname: Joi.string().required(),
        mimetype: Joi.string()
          .valid(
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel' // .xls
          )
          .required()
          .messages({
            'any.only': 'Le type de fichier doit être PDF, JPEG, PNG, XLS ou XLSX.',
          }),
        size: Joi.number().max(5 * 1024 * 1024).messages({
          'number.max': 'La taille du fichier ne doit pas dépasser 5 Mo.',
        }),
      }).unknown(true)
    )
    .optional(),
});

// Middleware de validation pour un "post"
const validatePost = (req, res, next) => {
  // Si un fichier est attaché via single('file'), le convertir en tableau pour la validation
  if (req.file) {
    req.body.files = [req.file];
  } else {
    req.body.files = [];
  }

  // Validation avec Joi
  const { error } = validatePostSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation échouée.',
      details: error.details.map((err) => err.message),
    });
  }

  next();
};

// Middleware Mongoose : Générer un postId unique avant d'enregistrer un post
const addPostIdMiddleware = (schema) => {
  schema.pre('save', async function (next) {
    if (!this.postId) {
      const count = await mongoose.models.Post.countDocuments();
      this.postId = `POST-${count + 1}`;
    }
    next();
  });
};

module.exports = {
  validatePost,
  addPostIdMiddleware,
};
