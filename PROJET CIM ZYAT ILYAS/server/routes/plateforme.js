const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('plat/plateforme', {
    title: 'Plateforme Page',
  });
});

router.get('/analyse/:type', (req, res) => {
    res.redirect(`/plat/formulaire?type=${req.params.type}`);
  });

module.exports = router;
