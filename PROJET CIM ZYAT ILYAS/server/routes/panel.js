const express = require('express');
const router = express.Router();
const connection = require('../connection.js'); 
const moment = require('moment');
const cors = require('cors');
const multer = require('multer');
const path = require('path');


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


router.get('/', async (req, res) => {
  if (!req.session.userId) {
    return res.status(403).send('Access denied');
  }

  try {
    // Fetch user details to ensure we have the updated name and picture
    const userDetailsQuery = `SELECT name, picture FROM users WHERE id = ?`;
    const [userDetails] = await connection.promise().query(userDetailsQuery, [req.session.userId]);

    if (userDetails.length === 0) {
      return res.status(404).send('User not found');
    }

    // Ensure the profile picture is set or use the default
    const profilePic = userDetails[0].picture || '/images/profile/default-profile.jpg';

    // Update session data with the latest name and picture
    req.session.userName = userDetails[0].name;
    req.session.userPicture = profilePic;

    // Fetch submission data
    const submissionQuery = `
      SELECT id, date_de_creation, form_name, status 
      FROM submission
      WHERE user_id = ?
      ORDER BY date_de_creation DESC
    `;
    const [submissions] = await connection.promise().query(submissionQuery, [req.session.userId]);

    // Map form_name to custom names
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

    // Fetch codes from respective form tables
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


    const showRespoStrucLink = req.session.access === 5 || req.session.access === 0;
    const showGestPlatLink = req.session.access >9 && req.session.access <99 || req.session.access === 0;
    const showDashboardLink = req.session.access === 100 || req.session.access === 0;


    res.render('plat/panel', {
      name: req.session.userName,
      submissions: formattedSubmissions,
      profilePic: req.session.userPicture,
      access: req.session.access,
      showRespoStrucLink,
      showGestPlatLink,
      showDashboardLink
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});


router.get('/view-form/:formName/:submissionId', async (req, res) => {
  const { formName, submissionId } = req.params;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(403).send('Access denied');
  }

  try {
    const submissionQuery = `SELECT * FROM submission WHERE id = ?`;
    const [submissionResult] = await connection.promise().query(submissionQuery, [submissionId]);

    if (submissionResult.length === 0) {
      return res.status(404).send('Submission not found');
    }

    const submissionUserId = submissionResult[0].user_id;

    const formQuery = `SELECT * FROM ${formName} WHERE submission_id = ?`;
    const [formResult] = await connection.promise().query(formQuery, [submissionId]);

    if (formResult.length === 0) {
      return res.status(404).send('Form details not found');
    }

    const userQuery = `SELECT * FROM users WHERE id = ?`;
    const [userResult] = await connection.promise().query(userQuery, [submissionUserId]);

    if (userResult.length === 0) {
      return res.status(404).send('User not found');
    }

    const structureId = userResult[0].structure_id;
    const structureQuery = `SELECT * FROM structure WHERE id = ?`;
    const [structureResult] = await connection.promise().query(structureQuery, [structureId]);

    if (structureResult.length === 0) {
      return res.status(404).send('Structure not found');
    }

    // Format the date_de_creation
    const formatDate = (date) => {
      return moment(date).format('DD/MM/YYYY HH:mm');
    };

    const formattedSubmission = {
      ...submissionResult[0],
      date_de_creation: formatDate(submissionResult[0].date_de_creation)
    };

    res.json({
      formDetails: formResult[0],
      submission: formattedSubmission,
      user: userResult[0],
      structure: structureResult[0]
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});


router.get('/delete-submission/:id', async (req, res) => {
  const submissionId = req.params.id;
  if (req.session.userId) {
    try {
      // Ensure the user is deleting their own submission
      const deleteQuery = 'DELETE FROM submission WHERE id = ? AND user_id = ?';
      const [result] = await connection.promise().query(deleteQuery, [submissionId, req.session.userId]);

      if (result.affectedRows > 0) {
        console.log('Submission deleted successfully');
        res.redirect('/plat/panel');
      } else {
        console.log('Submission not found or not authorized to delete');
        res.redirect('/plat/panel');
      }
    } catch (error) {
      console.error('Database delete error:', error);
      res.status(500).send('Error deleting submission');
    }
  } else {
    res.status(403).send('Access denied');
  }
});

router.post('/sign-submission/:submissionId', upload.single('signature'), async (req, res) => {
  const { submissionId } = req.params;

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const signaturePath = `/images/signatures/${req.file.filename}`;

  try {
    const updateQuery = 'UPDATE submission SET signature = ? WHERE id = ?';
    await connection.promise().query(updateQuery, [signaturePath, submissionId]);
    res.status(200).send('Submission signed successfully');
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).send('Error signing submission');
  }
});


router.post('/modify-submission/:submissionId', async (req, res) => {
  const { submissionId } = req.params;
  const { rubriqueMod } = req.body;

  try {
    const updateQuery = 'UPDATE submission SET rubrique_mod = ?, date_de_modif = ? WHERE id = ?';
    await connection.promise().query(updateQuery, [rubriqueMod, moment().format('YYYY-MM-DD HH:mm:ss'), submissionId]);
    res.status(200).send('Submission modified successfully');
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).send('Error modifying submission');
  }
});

router.post('/select-encadrant/:submissionId', async (req, res) => {
  const { submissionId } = req.params;
  const { encadrantId } = req.body;

  try {
    const updateQuery = 'UPDATE submission SET encadrant_id = ? WHERE id = ?';
    await connection.promise().query(updateQuery, [encadrantId, submissionId]);
    res.status(200).send('Encadrant selected successfully');
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).send('Error selecting encadrant');
  }
});

router.get('/get-encadrants', async (req, res) => {
  if (!req.session.userId) {
    return res.status(403).send('Access denied');
  }

  try {
    const userQuery = 'SELECT structure_id FROM users WHERE id = ?';
    const [userResult] = await connection.promise().query(userQuery, [req.session.userId]);

    if (userResult.length === 0) {
      return res.status(404).send('User not found');
    }

    const structureId = userResult[0].structure_id;
    const encadrantsQuery = 'SELECT id, name FROM users WHERE structure_id = ? AND access = 4';
    const [encadrants] = await connection.promise().query(encadrantsQuery, [structureId]);

    res.json({ encadrants });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});


module.exports = router;
