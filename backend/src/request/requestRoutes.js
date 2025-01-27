const express = require('express');
const router = express.Router();
const { validateRequest } = require('./requestMiddleware');
const requestController = require('./requestController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Vérifie si l'utilisateur est authentifié
const verifyRole = require('../middlewares/verifyRole'); // Vérifie le rôle de l'utilisateur
const upload = require('../file/fileService');

// Route pour soumettre une demande avec un seul fichier
router.post(
  '/submit',
  verifyToken,
  verifyRole(['EMPLOYEE', 'MANAGER', 'ADMIN']),
  upload.single('file'), 
  validateRequest,
  requestController.submitRequest
);


// Route pour voir les demandes d'un utilisateur connecté (employé)
router.get(
  '/my-requests',
  verifyToken, // Vérifie que l'utilisateur est connecté
  requestController.viewUserRequests // Renvoie les demandes de l'utilisateur
);


// Route pour voir toutes les demandes en attente (accessible uniquement par MANAGER et ADMIN)
router.get(
  '/pending',
  verifyToken, // Vérifie l'authentification
  verifyRole(['MANAGER', 'ADMIN']), // Seuls les managers et admins peuvent accéder
  requestController.viewPendingRequests // Renvoie les demandes en attente
);

// Route pour approuver une demande (accessible uniquement par MANAGER et ADMIN)
router.put(
  '/approve/:id',
  verifyToken, // Vérifie l'authentification
  verifyRole(['MANAGER', 'ADMIN']), // Rôle requis
  requestController.approveRequest // Contrôleur pour approuver la demande
);

// Route pour rejeter une demande (accessible uniquement par MANAGER et ADMIN)
router.put(
  '/reject/:id',
  verifyToken, // Vérifie l'authentification
  verifyRole(['MANAGER', 'ADMIN']), // Rôle requis
  requestController.rejectRequest // Contrôleur pour rejeter la demande
);
// GET /service/:serviceName
router.get('/service/:serviceName', async (req, res) => {
  try {
    const { serviceName } = req.params;
    const requests = await RequestService.getRequestsByService(serviceName);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
