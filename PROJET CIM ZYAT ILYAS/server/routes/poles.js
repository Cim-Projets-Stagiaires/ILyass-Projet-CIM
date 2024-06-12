const express = require('express');
const router = express.Router();

// Route pour la page Poles
router.get('/', function(req, res, next) {
  res.render('site/poles', { title: 'CIM' });
});

module.exports = router;
