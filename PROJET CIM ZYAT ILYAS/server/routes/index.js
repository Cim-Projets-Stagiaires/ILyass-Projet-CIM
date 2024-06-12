const express = require('express');
const router = express.Router();

// Importez les modèles ou modules nécessaires ici

// Route pour la page d'accueil
router.get('/', function(req, res, next) {
  res.render('site/index', { title: 'CIM' });
});

// Autres routes nécessaires pour votre page d'accueil

module.exports = router;
