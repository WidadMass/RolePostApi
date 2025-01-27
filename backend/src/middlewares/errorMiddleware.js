const errorMiddleware = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Les données envoyées sont invalides.',
        details: err.details,
      });
    }
  
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'Cet email est déjà pris.',
      });
    }
  
    return res.status(500).json({ message: err.message });
  };
  