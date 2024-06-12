const express = require('express');
const router = express.Router();

// Route pour la page Services
router.get('/', function(req, res, next) {
  res.render('site/video', { title: 'CIM' });
});

module.exports = router;
