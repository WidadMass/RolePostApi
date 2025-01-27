const postService = require('./postService');
const Post = require('./postModel');
const File = require('../file/fileModel');

// Création d'un post
exports.createPost = async (req, res) => {
  try {
    console.log('Corps de la requête (req.body) :', req.body);
    console.log('Fichier reçu (req.file) :', req.file);

    // Vérification d'authentification (req.user doit exister si verifyToken est appelé avant)
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    // Récupération des champs depuis le body
    const { title, content, category, tags } = req.body;

    // --- Validation de base ---
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Les champs title, content et category sont obligatoires.' });
    }

    // Création du post
    const post = new Post({
      userId: req.user.id,
      title,
      content,
      category,
      tags: tags ? tags.split(',') : [], // Si des tags sont fournis, les séparer par des virgules
    });

    // Enregistrement du post
    await post.save();

    // --- Gestion du fichier (single) ---
    if (req.file) {
      const newFile = new File({
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        filePath: req.file.path,
        userId: req.user.id, // L’utilisateur qui a uploadé
        postId: post._id, // Lien vers le post
      });
      await newFile.save();

      // Associer ce fichier au post
      post.files = [newFile._id];
      await post.save();
    }

    // Retour au client
    return res.status(201).json({
      message: 'Post créé avec succès.',
      post,
    });
  } catch (error) {
    console.log('Erreur lors de la création du post :', error.message);
    return res.status(500).json({
      error: `Erreur lors de la création du post : ${error.message}`,
    });
  }
};

// Récupérer les posts d'un utilisateur
exports.viewUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les posts en mode "Draft" (brouillon)
exports.viewDraftPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'Draft' });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Publier un post
exports.publishPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(
      id,
      { status: 'Published', publishedAt: new Date() },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post introuvable.' });
    }

    res.status(200).json({ message: 'Post publié avec succès.', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Archiver un post
exports.archivePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(
      id,
      { status: 'Archived' },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post introuvable.' });
    }

    res.status(200).json({ message: 'Post archivé avec succès.', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Récupérer tous les posts (accessible uniquement par l'administrateur)
exports.viewAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
