const express = require('express');
const router = express.Router();
const connection = require('../connection.js');
const moment = require('moment');


router.use((req, res, next) => {
  req.session.previousUrl = req.headers.referer || '/plat/respo_struc';
  next();
});

router.get('/', async (req, res) => {
  if (!req.session.userId) {
    return res.status(403).send('Access denied');
  }

  if (req.session.access !== 5 && req.session.access !== 0) {
    return res.status(403).send('Access denied');
  }

  try {
    const userDetailsQuery = `SELECT name, picture, structure_id FROM users WHERE id = ?`;
    const [userDetails] = await connection.promise().query(userDetailsQuery, [req.session.userId]);

    if (userDetails.length === 0) {
      return res.status(404).send('User not found');
    }

    const structureId = userDetails[0].structure_id;
    const profilePic = userDetails[0].picture || '/images/profile/default-profile.jpg';
    req.session.userName = userDetails[0].name;
    req.session.userPicture = profilePic;

    const submissionQuery = `
      SELECT s.id, s.date_de_creation, s.form_name, s.status, u.name as user_name, u.id as user_id
      FROM submission s
      JOIN users u ON s.user_id = u.id
      WHERE u.structure_id = ?
      ORDER BY s.date_de_creation DESC
    `;
    const [submissions] = await connection.promise().query(submissionQuery, [structureId]);

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

    res.render('plat/structure', {
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

router.get('/receive-submission/:submissionId', async (req, res) => {
  const { submissionId } = req.params;

  try {
    const updateStatusQuery = `UPDATE submission SET status = 'Demande reçue' WHERE id = ?`;
    await connection.promise().query(updateStatusQuery, [submissionId]);

    res.redirect('/plat/respo_struc');
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});

router.get('/deny-submission/:submissionId', async (req, res) => {
  const { submissionId } = req.params;

  try {
    const updateStatusQuery = `UPDATE submission SET status = 'Demande annulée' WHERE id = ?`;
    await connection.promise().query(updateStatusQuery, [submissionId]);

    res.redirect('/plat/respo_struc');
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
