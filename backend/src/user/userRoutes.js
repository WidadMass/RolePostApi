const express = require('express');
const router = express.Router();
const userController = require('./userController'); // Import du contrôleur utilisateur
const { verifyToken } = require('../middlewares/authMiddleware'); // Import du middleware d'authentification
const verifyRole = require('../middlewares/verifyRole'); // Middleware de vérification des rôles
const { validateRegister } = require('./userMiddleware'); // Middleware pour valider les données d'inscription


// Routes Publiques

// Connexion d'un utilisateur
router.post('/login', userController.loginUser);

// Enregistrer un utilisateur (Uniquement par un admin, réactivation de `verifyRole`)
router.post('/register', /*verifyToken, verifyRole(['ADMIN']),*/ validateRegister, userController.registerUser);


// Routes pour Utilisateur Connecté


// Récupérer le profil de l'utilisateur connecté
router.get('/me', verifyToken, userController.getMyProfile);

// Mise à jour du mot de passe d'un utilisateur connecté
router.patch('/:id/password', verifyToken, userController.updatePassword);


// Routes Administrateur


// Récupérer tous les utilisateurs
router.get('/', verifyToken, verifyRole(['ADMIN']), userController.getAllUsers);

// Récupérer un utilisateur spécifique par ID
router.get('/:id', verifyToken, verifyRole(['ADMIN']), userController.getUserById);

// Mettre à jour un utilisateur spécifique
router.put('/:id', verifyToken, verifyRole(['ADMIN']), userController.updateUser);

// Activer/Désactiver un utilisateur
router.put('/:userId/toggle-status', verifyToken, verifyRole(['ADMIN']), userController.toggleUserStatus);

// Supprimer un utilisateur
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), userController.deleteUser);

module.exports = router;
