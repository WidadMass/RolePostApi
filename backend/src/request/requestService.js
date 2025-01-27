const Request = require('./requestModel');
const User = require('../user/userModel');

const RequestService = {
  /**
   * Crée une nouvelle demande
   * @param {Object} requestData - Les données de la demande
   * @returns {Object} - La demande créée
   */
  async createRequest(requestData) {
    try {
      const request = new Request(requestData);
      return await request.save();
    } catch (error) {
      throw new Error(`Erreur lors de la création de la demande : ${error.message}`);
    }
  },

  /**
   * Récupère les demandes d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Array} - Liste des demandes de l'utilisateur
   */
  async getRequestsByUser(userId) {
    try {
      return await Request.find({ userId })
        .populate('files') // Inclut les fichiers liés
        .populate('userId', 'firstName lastName email') // Inclut les infos utilisateur
        .sort({ createdAt: -1 }); // Trie par date de création
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des demandes : ${error.message}`);
    }
  },

  /**
   * Récupère toutes les demandes en attente
   * @returns {Array} - Liste des demandes en attente
   */
  async getPendingRequests() {
    try {
      return await Request.find({ status: 'Pending' })
        .populate('files') // Inclut les fichiers liés
        .populate('userId', 'firstName lastName email') // Inclut les infos utilisateur
        .sort({ createdAt: -1 }); // Trie par date de création
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des demandes en attente : ${error.message}`);
    }
  },

  /**
   * Approuve une demande
   * @param {string} requestId - ID de la demande
   * @returns {Object} - La demande mise à jour
   */
  async approveRequest(requestId) {
    try {
      const request = await Request.findById(requestId);
      if (!request) {
        throw new Error('Demande introuvable.');
      }
      request.status = 'Approved';
      return await request.save();
    } catch (error) {
      throw new Error(`Erreur lors de l'approbation de la demande : ${error.message}`);
    }
  },

  /**
   * Rejette une demande
   * @param {string} requestId - ID de la demande
   * @param {string} reason - Motif du rejet
   * @returns {Object} - La demande mise à jour
   */
  async rejectRequest(requestId, reason) {
    try {
      const request = await Request.findById(requestId);
      if (!request) {
        throw new Error('Demande introuvable.');
      }
      request.status = 'Rejected';
      request.reason = reason;
      return await request.save();
    } catch (error) {
      throw new Error(`Erreur lors du rejet de la demande : ${error.message}`);
    }
  },

  /**
   * Récupère toutes les demandes d'un service particulier
   * @param {string} serviceName - Nom du service (ex: "Technique", "Commercial", ...)
   * @returns {Array} - Liste des demandes liées à ce service
   */
  async getRequestsByService(serviceName) {
    try {
      return await Request.find({ service: serviceName })
        .populate('files') // Inclut les fichiers liés
        .populate('userId', 'firstName lastName email') // Inclut les infos utilisateur
        .sort({ createdAt: -1 }); // Trie par date de création
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des demandes par service : ${error.message}`);
    }
  },
};

module.exports = RequestService;
