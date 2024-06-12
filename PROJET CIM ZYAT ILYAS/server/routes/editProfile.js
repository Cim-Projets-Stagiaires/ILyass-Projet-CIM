const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const connection = require('../connection'); 
const saltRounds = 10;
const multer = require('multer');
const path = require('path');


router.use((req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(403).send('Unauthorized access.');
  }
  next();
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/profile/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/etablissements', (req, res) => {
  connection.query('SELECT DISTINCT etablissement FROM structure ORDER BY etablissement', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results.map(row => row.etablissement));
  });
});

router.get('/api/structures/:etablissement', (req, res) => {
  const etablissement = req.params.etablissement;
  connection.query('SELECT id, name FROM structure WHERE etablissement = ?', [etablissement], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database query error');
    }
    res.json(results);
  });
});

router.get('/', async (req, res) => {
  const userId = req.session.userId;
  try {
    const userDetailsQuery = `
      SELECT u.name, u.email, u.phone, u.structure_id, s.name AS structure_name, s.etablissement AS etablissement_name, u.status, u.niveau, u.picture
      FROM users u
      LEFT JOIN structure s ON u.structure_id = s.id
      WHERE u.id = ?;
    `;
    const [userDetails] = await connection.promise().query(userDetailsQuery, [userId]);

    if (userDetails.length === 0) {
      return res.status(404).send('User not found');
    }

    const [etablissements] = await connection.promise().query('SELECT DISTINCT etablissement FROM structure ORDER BY etablissement;');
    const [structures] = await connection.promise().query('SELECT id, name FROM structure WHERE etablissement = ?', [userDetails[0].etablissement_name]);

    res.render('plat/editProfile', {
      userData: userDetails[0],
      etablissements,
      structures,
      selectedStructureId: userDetails[0].structure_id,
      selectedEtablissement: userDetails[0].etablissement_name
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

router.post('/', upload.single('profilePic'), async (req, res) => {
  const { name, phone, oldPassword, newPassword, confirmPassword, structure_id, status, niveau } = req.body;
  const userId = req.session.userId;

  try {
    const [userResult] = await connection.promise().query('SELECT password, picture FROM users WHERE id = ?', [userId]);
    const user = userResult[0];

    if (!user) {
      return res.status(404).send('User not found.');
    }

    if (!oldPassword || !user.password) {
      return res.status(400).send("Missing password data.");
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(401).send("Old password is incorrect.");
    }

    let filePath = user.picture;

    if (req.file) {
      filePath = '/images/profile/' + req.file.filename;
    }

    let hashedPassword = user.password;
    if (newPassword && newPassword === confirmPassword) {
      hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      console.log("Password updated");
    } else if (newPassword !== confirmPassword) {
      return res.status(400).send("New passwords do not match.");
    }

    await connection.promise().query(
      'UPDATE users SET name = ?, phone = ?, password = ?, picture = ?, structure_id = ?, status = ?, niveau = ? WHERE id = ?',
      [name, phone, hashedPassword, filePath || user.picture, structure_id, status, status === 'Etudiant' ? niveau : null, userId]
    );

    req.session.userName = name;

    res.redirect('/plat/panel');
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send("Failed to update profile.");
  }
});

module.exports = router;
