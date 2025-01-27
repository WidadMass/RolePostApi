const bcrypt = require('bcrypt');
const User = require('./userModel');

// Vérifier si l'utilisateur existe par email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Créer un nouvel utilisateur avec un mot de passe haché
const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({ ...userData, password: hashedPassword });
  return await newUser.save();
};

module.exports = {
  findUserByEmail,
  createUser,
};
