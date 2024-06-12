const express = require('express');
const router = express.Router();
const connection = require('../connection.js');
const moment = require('moment');
const multer = require('multer');
const path = require('path');


router.use((req, res, next) => {
  req.session.previousUrl = req.headers.referer || '/plat/gest_plat';
  next();
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = file.fieldname === 'partiel' ? 'public/files/partiel' : 'public/files/final';
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  
  if (!req.session.userId) {
    return res.status(403).send('Access denied');
  }

  if (req.session.access < 9 && req.session.access !== 0) {
    return res.status(403).send('Access denied');
  }

  try {
    const userDetailsQuery = `SELECT name, picture, structure_id FROM users WHERE id = ?`;
    const [userDetails] = await connection.promise().query(userDetailsQuery, [req.session.userId]);

    if (userDetails.length === 0) {
      return res.status(404).send('User not found');
    }

    const profilePic = userDetails[0].picture || '/images/profile/default-profile.jpg';
    req.session.userName = userDetails[0].name;
    req.session.userPicture = profilePic;


    let formNames = [];
    if (req.session.access === 10 || req.session.access === 100) {
      formNames = ['form_AZS', 'form_AMCT'];
    } else if (req.session.access === 20 || req.session.access === 100) {
      formNames = ['form_CHNSO', 'form_SAA', 'form_UV', 'form_TOC', 'form_PIC'];
    } else if (req.session.access === 30 || req.session.access === 100) {
      formNames = ['form_AAM', 'form_RDMO'];
    } else if (req.session.access === 40 || req.session.access === 100) {
      formNames = ['form_UHPLC'];
    }

    if (formNames.length === 0) {
      return res.status(403).send('Access denied');
    }

    const submissionQuery = `
      SELECT s.id, s.date_de_creation, s.form_name, s.status, u.name as user_name, u.id as user_id
      FROM submission s
      JOIN users u ON s.user_id = u.id
      WHERE s.form_name IN (?)
      AND s.status NOT IN ('Demande déposée', 'Demande annulée')
      ORDER BY s.date_de_creation DESC
    `;
    const [submissions] = await connection.promise().query(submissionQuery, [formNames]);

    const formNameMap = {
      'form_AZS': 'Demande d\'analyse par Zeta-Sizer',
      'form_AMCT': 'Demande d\'analyse par l\'appareil de mesure de conductivité thermique',
      'form_AAM': 'Demande d\'analyse par activité antimicrobienne',
      'form_RDMO': 'Demande d\'analyse par recherche et dénombrement des micro-organismes',
      'form_CHNSO': 'Demande d\'analyse d\'éléments CHNS-O',
      'form_SAA': 'Demande d\'analyse par la Spectrométrie d\'Absorption Atomique',
      'form_UV': 'Demande d\'analyse par spectrophotomètre UV - Visible',
      'form_TOC': 'Demande par Analyseur TOC',
      'form_PIC': 'Demande d\'analyses isotropiques des eaux (PICARRO)',
      'form_UHPLC': 'Demande par Analyseur UHPLC'
    };

    for (let submission of submissions) {
      let formCodeQuery = '';
      switch (submission.form_name) {
        case 'form_AZS':
          formCodeQuery = `SELECT code FROM form_azs WHERE submission_id = ?`;
          break;
        case 'form_AMCT':
          formCodeQuery = `SELECT code FROM form_amct WHERE submission_id = ?`;
          break;
        case 'form_AAM':
          formCodeQuery = `SELECT code FROM form_aam WHERE submission_id = ?`;
          break;
        case 'form_RDMO':
          formCodeQuery = `SELECT code FROM form_rdmo WHERE submission_id = ?`;
          break;
        case 'form_CHNSO':
          formCodeQuery = `SELECT code FROM form_chnso WHERE submission_id = ?`;
          break;
        case 'form_SAA':
          formCodeQuery = `SELECT code FROM form_saa WHERE submission_id = ?`;
          break;
        case 'form_UV':
          formCodeQuery = `SELECT code FROM form_uv WHERE submission_id = ?`;
          break;
        case 'form_TOC':
          formCodeQuery = `SELECT code FROM form_toc WHERE submission_id = ?`;
          break;
        case 'form_PIC':
          formCodeQuery = `SELECT code FROM form_pic WHERE submission_id = ?`;
          break;
        case 'form_UHPLC':
          formCodeQuery = `SELECT code FROM form_uhplc WHERE submission_id = ?`;
          break;
        default:
          continue;
      }

      if (formCodeQuery) {
        const [formCodeResult] = await connection.promise().query(formCodeQuery, [submission.id]);
        submission.code = formCodeResult.length > 0 ? formCodeResult[0].code : 'N/A';
      }
    }

    const formattedSubmissions = submissions.map(submission => ({
      ...submission,
      date_de_creation: moment(submission.date_de_creation).format('DD/MM/YYYY HH:mm'),
      form_label: formNameMap[submission.form_name] || submission.form_name,
      form_name: submission.form_name
    }));

    res.render('plat/gest_plat', {
      name: req.session.userName,
      submissions: formattedSubmissions,
      profilePic: req.session.userPicture,
      referer: req.session.previousUrl
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});

router.get('/viewProfile/:userId', async (req, res) => {
  const { userId } = req.params;

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

    const structureQuery = `SELECT * FROM structure WHERE id = ?`;
    const [structureResult] = await connection.promise().query(structureQuery, [userDetails[0].structure_id]);

    if (structureResult.length === 0) {
      return res.status(404).send('Structure not found');
    }

    res.render('plat/viewProfile', {
      userData: userDetails[0],
      structure: structureResult[0],
      referer: req.session.previousUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

router.post('/update-status/:submissionId', async (req, res) => {
  const { submissionId } = req.params;
  const { newStatus } = req.body;

  try {
    const updateStatusQuery = newStatus === 'Demande approuvée' ?
      `UPDATE submission SET status = ?, date_approuved = NOW() WHERE id = ?` :
      `UPDATE submission SET status = ? WHERE id = ?`;

    await connection.promise().query(updateStatusQuery, [newStatus, submissionId]);

    res.redirect('/plat/gest_plat');
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});


router.post('/upload/:submissionId', upload.fields([{ name: 'partiel' }, { name: 'final' }]), async (req, res) => {
  const { submissionId } = req.params;
  const partielFile = req.files['partiel'] ? req.files['partiel'][0].filename : null;
  const finalFile = req.files['final'] ? req.files['final'][0].filename : null;

  try {
    // Retrieve current values
    const currentFilesQuery = `SELECT partiel, final FROM submission WHERE id = ?`;
    const [currentFiles] = await connection.promise().query(currentFilesQuery, [submissionId]);

    const updatedPartiel = partielFile || currentFiles[0].partiel;
    const updatedFinal = finalFile || currentFiles[0].final;

    const updateQuery = `
      UPDATE submission 
      SET partiel = ?, final = ? 
      WHERE id = ?
    `;
    await connection.promise().query(updateQuery, [updatedPartiel, updatedFinal, submissionId]);

    res.redirect('/plat/gest_plat');
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
