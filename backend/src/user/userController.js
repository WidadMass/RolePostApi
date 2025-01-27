const User = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    // Trouver l'utilisateur par son ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    // Basculer le statut actif/inactif
    user.isActive = !user.isActive;

    // Sauvegarder les modifications
    await user.save();

    res.status(200).json({
      message: `Le statut de l'utilisateur a été ${user.isActive ? 'activé' : 'désactivé'}.`,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la modification du statut : ${error.message}` });
  }
};



/**
 * Enregistrer un nouvel utilisateur
 * POST /api/users/register
 */
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Créer un nouvel utilisateur sans hacher le mot de passe ici
    const newUser = new User({
      firstName,
      lastName,
      email,
      password, // Le mot de passe sera haché par le middleware de pré-sauvegarde
      phone: phone || '',
      role: role || 'USER', // Par défaut, rôle USER si non spécifié
    });

    await newUser.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isActive: newUser.isActive,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};


/**
 * Connexion d'un utilisateur
 * POST /api/users/login
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Comparer le mot de passe

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Mot de passe saisi :', password);
    console.log('Mot de passe haché stocké :', user.password);
    console.log('Résultat de la comparaison :', isPasswordValid);
    if (!isPasswordValid) {
      console.log('Mot de passe incorrect.');
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Si tout est bon, générer un token (si nécessaire)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};


/**
 * Récupérer le profil de l'utilisateur connecté
 * GET /api/users/me
 */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclure le mot de passe

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil :', error.message);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

/**
 * Récupérer un utilisateur par son ID
 * GET /api/users/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête

    // Rechercher l'utilisateur par ID dans la base de données
    const user = await User.findById(id).select('-password'); // Exclure le champ `password` pour des raisons de sécurité

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Retourner les informations de l'utilisateur
    res.status(200).json(user);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur avec l'ID ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

/**
 * Récupérer tous les utilisateurs
 * GET /api/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Rechercher tous les utilisateurs, sans inclure leurs mots de passe
    const users = await User.find().select('-password'); // Exclure le champ `password` pour des raisons de sécurité
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.', error: error.message });
  }
};
/**
 * Mettre à jour le mot de passe d'un utilisateur
 * PATCH /api/users/:id/password
 */
/**
 * Mettre à jour un utilisateur
 * PATCH /api/users/:id
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID de l'utilisateur à mettre à jour
    const { currentPassword, newPassword, ...updateFields } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Si un changement de mot de passe est demandé
    if (currentPassword && newPassword) {
      // Vérifier l'ancien mot de passe
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
      }

      // Générer un nouveau mot de passe haché
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Ajouter le mot de passe haché aux champs à mettre à jour
      updateFields.password = hashedPassword;
    }

    // Mettre à jour les autres champs
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true } // Retourne l'utilisateur mis à jour et applique les validations du modèle
    ).select('-password'); // Exclure le mot de passe de la réponse

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'utilisateur avec l'ID ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};



exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'L\'ancien mot de passe et le nouveau mot de passe sont requis.',
      });
    }

    const user = await User.findById(req.user.id); // Assurez-vous que l'utilisateur est connecté
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe :', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

/**
 * Supprimer un utilisateur
 * DELETE /api/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};
