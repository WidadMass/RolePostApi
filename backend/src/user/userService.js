const bcrypt = require('bcrypt');
const User = require('./userModel');

// Vérifier si l'utilisateur existe par email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Créer un nouvel utilisateur avec un mot de passe haché
const createUser = async (userData) => {
  const newUser = new User(userData); // Le mot de passe sera haché par le middleware
  console.log('Mot de passe en clair :', userData.password);
  await newUser.save();
  console.log('Mot de passe haché :', newUser.password);
  return newUser;
};

module.exports = {
  findUserByEmail,
  createUser,
};
