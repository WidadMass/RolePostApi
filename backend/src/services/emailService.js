const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Ou un autre service comme Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL, // Adresse email de l'expéditeur (dans .env)
    pass: process.env.EMAIL_PASSWORD // Mot de passe ou clé d'application
  }
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL, // Expéditeur
    to, // Destinataire
    subject, // Sujet de l'email
    text // Contenu de l'email
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email envoyé à ${to}`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
  }
};

module.exports = { sendEmail };
