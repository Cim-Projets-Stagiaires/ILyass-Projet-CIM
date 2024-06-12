const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('An error occurred while logging out.');
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
