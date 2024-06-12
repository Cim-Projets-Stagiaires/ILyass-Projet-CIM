const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mysqlConnection = require('../connection');
const saltRounds = 10;


router.get('/login', (req, res) => {
  res.render('plat/auth');
});


router.get('/etablissements', (req, res) => {
  mysqlConnection.query('SELECT DISTINCT etablissement FROM structure ORDER BY etablissement', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});


router.get('/structures/:etablissement', (req, res) => {
  mysqlConnection.query(
    'SELECT id, name FROM structure WHERE etablissement = ?',
    [req.params.etablissement],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Database query error' });
      } else {
        res.json(results);
      }
    }
  );
});



router.post('/register', async (req, res) => {
  const { name, email, phone, password, confirm_password, etablissement, structure, status, niveau } = req.body;

  if (!name || !email || !phone || !password || !confirm_password || !etablissement || !structure || !status || (status === 'Etudiant' && !niveau)) {
    return res.status(400).render('plat/auth', { error: 'Tout les champs doivent etre remplis.' });
  }

  const [users] = await mysqlConnection.promise().query('SELECT id FROM users WHERE email = ?', [email]);
  if(users.length > 0) {
    return res.status(400).json({ emailError: 'Email existant, veuillez saisir un autre Email' });
  }

  if(!/^\+?\d{10,15}$/.test(phone)) {
    return res.status(400).json({ error: 'Le numéro de téléphone ne doit contenir que des chiffres et avoir une longueur comprise entre 10 et 15 caractères.' });
  }

  if(password !== confirm_password) {
    return res.status(400).json({ pwdError: 'Les mots de passe ne correspondent pas' });
  }

  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const defaultAccessLevel = 1;
    const defaultProfilePicture = '/images/profile/default-profile.jpg';

    const userData = {
        name,
        email,
        phone,
        password: hashedPassword,
        access: defaultAccessLevel,
        structure_id: structure,
        status,
        niveau: (status === 'Etudiant') ? niveau : null,
        picture: defaultProfilePicture
    };

    await mysqlConnection.promise().query('INSERT INTO users SET ?', userData);

    res.status(200).json({ success: 'Compte enregistré avec succès' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).render('plat/auth', { error: 'An error occurred during registration' });
  }
});





router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [result] = await mysqlConnection.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (result.length === 0) {
      return res.status(404).json({ errorEmail: 'Email introuvable' });
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ errorPwd: 'Mot de passe incorrect' });
    }


    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.access = user.access;

    if (user.access === 1) {
      res.json({ redirect: '/plat/panel' });
    } else if (user.access === 100) {
      res.json({ redirect: '/plat/dashboard' });
    } else if (user.access === 5) {
      res.json({ redirect: '/plat/respo_struc' });
    } else if (user.access > 9 && user.access < 99) {
      res.json({ redirect: '/plat/gest_plat' });
    } 
  } catch (error) {
    res.status(500).json({ error: 'An internal error occurred' });
  }
});




module.exports = router;
