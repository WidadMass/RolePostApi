const express = require('express');
const router = express.Router();
const userController = require('./userController'); // Import du contrôleur utilisateur
const { verifyToken } = require('../middlewares/authMiddleware'); // Import des middlewares
const verifyRole = require('../middlewares/verifyRole');
const { validateRegister } = require('./userMiddleware'); // Import du middleware de validation

// Routes publiques
router.post('/login', userController.loginUser);

// Routes protégées (nécessitent un token)
router.patch('/:id/password', verifyToken, userController.updatePassword);

// Route pour enregistrer un utilisateur (accessible uniquement par ADMIN)
router.post('/register', verifyToken, verifyRole(['ADMIN']), validateRegister, userController.registerUser);

// Route pour récupérer tous les utilisateurs (accessible uniquement par ADMIN)
router.get('/', verifyToken, verifyRole(['ADMIN']), userController.getAllUsers);

// Route pour récupérer le profil de l'utilisateur connecté
router.get('/me', verifyToken, userController.getMyProfile);

// Route pour récupérer un utilisateur spécifique par ID
router.get('/:id', verifyToken, userController.getUserById);

// Route pour mettre à jour un utilisateur spécifique par ID
router.put('/:id', verifyToken, userController.updateUser);

// Route pour activer/désactiver un utilisateur
router.put('/:userId/toggle-status', verifyToken, verifyRole(['ADMIN']), userController.toggleUserStatus);

// Route pour supprimer un utilisateur (accessible uniquement par ADMIN)
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), userController.deleteUser);

module.exports = router; // Export du routeur
