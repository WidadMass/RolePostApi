const RequestService = require('./requestService');
const { sendEmail } = require('../services/emailService');
const Request = require('./requestModel');
const File = require('../file/fileModel');

exports.submitRequest = async (req, res) => {
  try {
    console.log('Corps de la requête (req.body) :', req.body);
    console.log('Fichier reçu (req.file) :', req.file);

    // Vérification d'authentification (req.user doit exister si verifyToken est appelé avant)
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    // Récupération des champs depuis le body
    // Champs communs
    const {
      type,
      description,
      startDate,
      endDate,
      service,
      // Champs spécifiques Congé
      natureConge,
      // Champs spécifiques Note de Frais
      periodeFrais,
      montantFrais,
      // Champs spécifiques Incident
      incidentDescription,
    } = req.body;

    // --- Validation de base ---
    if (!type) {
      return res.status(400).json({ error: 'Le type de demande est obligatoire.' });
    }

    // Exemple : si Congé ou Incident => startDate obligatoire
    if ((type === 'Congé' ) && !startDate) {
      return res.status(400).json({ error: 'Une date de début est obligatoire pour ce type.' });
    }

    // Validation conditionnelle plus poussée
    switch (type) {
      case 'Congé':
        if (!natureConge) {
          return res
            .status(400)
            .json({ error: 'La nature du congé est obligatoire.' });
        }
        break;

      case 'Note de Frais':
        if (!periodeFrais || !montantFrais) {
          return res.status(400).json({
            error:
              'La période et le montant sont obligatoires pour la note de frais.',
          });
        }
        break;

      case 'Incident':
        if ( !incidentDescription) {
          return res.status(400).json({
            error:
              ' la description sont obligatoires pour un incident.',
          });
        }
        break;

      case 'Autre Demande':
        // Aucune validation spéciale pour l’exemple
        break;

      default:
        return res.status(400).json({ error: 'Type de demande non reconnu.' });
    }

    // --- Création de la demande ---
    // On stocke tous les champs potentiels dans le modèle
    const request = new Request({
      userId: req.user.id,           // l'utilisateur connecté
      type,
      description: description || '',

      // Dates
      startDate: startDate || null,
      endDate: endDate || null,

      // Champ commun "service"
      service: service || null,

      // Congé
      natureConge: natureConge || null,

      // Note de Frais
      periodeFrais: periodeFrais || null,
      montantFrais: montantFrais || null,

      // Incident

      incidentDescription: incidentDescription || null,
    });

    // On enregistre la demande pour avoir son _id
    await request.save();

    // --- Gestion du fichier (single) ---
    if (req.file) {
      // Créer un document File qui référence la demande
      const newFile = new File({
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        filePath: req.file.path,
        userId: req.user.id,   // l’utilisateur qui a uploadé
        requestId: request._id // lien vers la demande
      });
      await newFile.save();

      // Associer ce fichier à la demande
      request.files = [newFile._id];
      await request.save();
    }

    // Retour au client
    return res.status(201).json({
      message: 'Demande soumise avec succès.',
      request,
    });
  } catch (error) {
    console.log('Erreur lors de la soumission de la demande :', error.message);
    return res.status(500).json({
      error: `Erreur lors de la création de la demande : ${error.message}`,
    });
  }
};


exports.viewUserRequests = async (req, res) => {
  try {
    const requests = await RequestService.getRequestsByUser(req.user.id);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.viewPendingRequests = async (req, res) => {
  try {
    const requests = await RequestService.getPendingRequests();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params; // L’ID de la demande
    // ex. si c’est l’ObjectId Mongoose : Request.findByIdAndUpdate
    // ou si c’est un champ `requestId` custom : Request.findOneAndUpdate({ requestId: id }, ...)
    const request = await Request.findByIdAndUpdate(
      id,
      { status: 'Approved' },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Demande introuvable.' });
    }


    res.status(200).json({ message: 'Demande approuvée avec succès.', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const request = await RequestService.rejectRequest(id, reason);
    res.status(200).json({ message: 'Demande rejetée avec succès.', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
