const Post = require('./postModel');
const User = require('../user/userModel');

const postService = {
  /**
   * Crée un nouveau post
   * @param {Object} postData - Les données du post
   * @returns {Object} - Le post créé
   */
  async createPost(postData) {
    try {
      const post = new Post(postData);
      return await post.save();
    } catch (error) {
      throw new Error(`Erreur lors de la création du post : ${error.message}`);
    }
  },

  /**
   * Récupère les posts d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Array} - Liste des posts de l'utilisateur
   */
  async getPostsByUser(userId) {
    try {
      return await Post.find({ userId })
        .populate('files') // Inclut les fichiers liés
        .populate('userId', 'firstName lastName email') // Inclut les infos utilisateur
        .sort({ createdAt: -1 }); // Trie par date de création
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des posts : ${error.message}`);
    }
  },

  /**
   * Récupère tous les posts en mode brouillon
   * @returns {Array} - Liste des posts en mode brouillon
   */
  async getDraftPosts() {
    try {
      return await Post.find({ status: 'Draft' })
        .populate('files') // Inclut les fichiers liés
        .populate('userId', 'firstName lastName email') // Inclut les infos utilisateur
        .sort({ createdAt: -1 }); // Trie par date de création
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des posts en mode brouillon : ${error.message}`);
    }
  },

  /**
   * Publie un post
   * @param {string} postId - ID du post
   * @returns {Object} - Le post mis à jour
   */
  async publishPost(postId) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('Post introuvable.');
      }
      post.status = 'Published';
      post.publishedAt = new Date(); // Ajoute la date de publication
      return await post.save();
    } catch (error) {
      throw new Error(`Erreur lors de la publication du post : ${error.message}`);
    }
  },

  /**
   * Archive un post
   * @param {string} postId - ID du post
   * @returns {Object} - Le post mis à jour
   */
  async archivePost(postId) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('Post introuvable.');
      }
      post.status = 'Archived';
      return await post.save();
    } catch (error) {
      throw new Error(`Erreur lors de l'archivage du post : ${error.message}`);
    }
  },

  /**
   * Récupère les posts par catégorie
   * @param {string} category - Nom de la catégorie
   * @returns {Array} - Liste des posts liés à cette catégorie
   */
  async getPostsByCategory(category) {
    try {
      return await Post.find({ category })
        .populate('files') // Inclut les fichiers liés
        .populate('userId', 'firstName lastName email') // Inclut les infos utilisateur
        .sort({ createdAt: -1 }); // Trie par date de création
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des posts par catégorie : ${error.message}`);
    }
  },
};

module.exports = postService;
