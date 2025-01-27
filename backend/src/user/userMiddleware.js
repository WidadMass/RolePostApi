const Joi = require('joi');

// Schéma Joi pour valider les données d'inscription
const registerSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({
      'string.base': 'Le prénom doit être une chaîne de caractères.',
      'string.empty': 'Le prénom est requis.',
      'string.min': 'Le prénom doit comporter au moins 2 caractères.',
      'string.max': 'Le prénom ne peut pas dépasser 30 caractères.',
      'any.required': 'Le prénom est obligatoire.',
    }),
  lastName: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({
      'string.base': 'Le nom doit être une chaîne de caractères.',
      'string.empty': 'Le nom est requis.',
      'string.min': 'Le nom doit comporter au moins 2 caractères.',
      'string.max': 'Le nom ne peut pas dépasser 30 caractères.',
      'any.required': 'Le nom est obligatoire.',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Veuillez fournir une adresse email valide.',
      'string.empty': 'L\'email est requis.',
      'any.required': 'L\'email est obligatoire.',
    }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
    .required()
    .messages({
      'string.empty': 'Le mot de passe est requis.',
      'string.min': 'Le mot de passe doit comporter au moins 6 caractères.',
      'string.pattern.base': 'Le mot de passe doit inclure au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.',
      'any.required': 'Le mot de passe est obligatoire.',
    }),
  phone: Joi.string()
    .pattern(new RegExp(/^(\+?\d{1,3}[- ]?)?\d{10}$/))
    .allow('')
    .default('')
    .messages({
      'string.pattern.base': 'Le numéro de téléphone doit être valide (10 chiffres).',
    }),
  role: Joi.string()
    .valid('EMPLOYEE', 'MANAGER', 'ADMIN')
    .default('EMPLOYEE')
    .messages({
      'any.only': 'Le rôle doit être EMPLOYEE, MANAGER ou ADMIN.',
    }),
  service: Joi.string()
    .valid('Technique', 'Commercial', 'Administration')
    .required()
    .messages({
      'any.only': 'Le service doit être Technique, Commercial ou Administration.',
      'any.required': 'Le service est obligatoire.',
    }),
});

// Middleware pour valider les données d'inscription
const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false }); // Valider tous les champs avant de retourner une erreur
  if (error) {
    return res.status(400).json({ message: 'Validation échouée.', details: error.details });
  }
  next();
};

module.exports = {
  validateRegister,
};
