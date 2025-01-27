const express = require('express');
const router = express.Router();
const postController = require('./postController');
const { verifyToken } = require('../middlewares/authMiddleware');
const verifyRole = require('../middlewares/verifyRole');
const upload = require('../file/fileService');

// Route pour créer un post (accessible aux rôles AUTHOR et ADMIN)
router.post(
  '/create',
  verifyToken,
  verifyRole(['AUTHOR', 'ADMIN']),
  upload.single('file'),
  postController.createPost
);

// Route pour voir les posts de l'utilisateur connecté (accessible à tous les utilisateurs authentifiés)
router.get(
  '/my-posts',
  verifyToken,
  verifyRole(['USER', 'AUTHOR', 'ADMIN']),
  postController.viewUserPosts
);

// Route pour voir tous les brouillons (accessible uniquement aux rôles ADMIN)
router.get(
  '/drafts',
  verifyToken,
  verifyRole(['ADMIN']),
  postController.viewDraftPosts
);

// Route pour publier un post (accessible uniquement aux rôles ADMIN)
router.patch(
  '/publish/:id',
  verifyToken,
  verifyRole(['ADMIN']),
  postController.publishPost
);

// Route pour archiver un post (accessible uniquement aux rôles ADMIN)
router.patch(
  '/archive/:id',
  verifyToken,
  verifyRole(['ADMIN']),
  postController.archivePost
);



// Route pour voir tous les posts (accessible uniquement aux administrateurs)
router.get(
  '/all-posts',
  verifyToken,
  verifyRole(['ADMIN']),
  postController.viewAllPosts
);


// Route pour obtenir les posts par catégorie (accessible à tous les utilisateurs authentifiés)
router.get('/category/:categoryName', verifyToken, async (req, res) => {
  try {
    const { categoryName } = req.params;
    const posts = await postService.getPostsByCategory(categoryName);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
