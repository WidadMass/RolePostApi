const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Définir le schéma de l'utilisateur
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {
    type: String,
    default: null,
    validate: {
      validator: function (v) {
        return !v || /^(\+?\d{1,3}[- ]?)?\d{10}$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un numéro de téléphone valide.`,
    },
  },
  role: {
    type: String,
    enum: ['ADMIN', 'AUTHOR', 'USER'],
    default: 'USER',
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Middleware : Hachage du mot de passe avant l'enregistrement
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Éviter de redéfinir le modèle
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
