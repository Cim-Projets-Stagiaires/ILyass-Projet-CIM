const express = require('express');
const router = express.Router();

// Route pour la page Services
router.get('/', function(req, res, next) {
  res.render('site/services', { title: 'CIM' });
});

module.exports = router;
