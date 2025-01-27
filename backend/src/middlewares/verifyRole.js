const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Utilisateur non authentifié.' });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Accès refusé. Rôle requis : ${allowedRoles.join(' ou ')}.`,
      });
    }

    next(); // L'utilisateur a un rôle autorisé, passer au contrôleur suivant
  };
};

module.exports = verifyRole;
