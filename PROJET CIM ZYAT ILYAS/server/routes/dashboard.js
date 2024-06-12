
const express = require('express');
const router = express.Router();
const connection = require('../connection.js');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');


function formatChartData(data, labelKey, valueKey) {
  return {
    labels: data.map(row => row[labelKey]),
    values: data.map(row => row[valueKey])
  };
}

function formatStackedBarChartData(data, categoryField, seriesField, valueField) {
  const categories = Array.from(new Set(data.map(item => item[categoryField])));
  const series = Array.from(new Set(data.map(item => item[seriesField])));
  const seriesData = series.map(serie => ({
    name: serie,
    type: 'bar',
    stack: 'total',
    label: {
      show: true
    },
    data: categories.map(category => {
      const item = data.find(d => d[categoryField] === category && d[seriesField] === serie);
      return item ? item[valueField] : 0;
    })
  }));

  return {
    categories,
    series: seriesData
  };
}


router.get('/', async (req, res) => {
  if (!req.session.userId) {
    return res.status(403).send('Access denied');
  }

  if (req.session.access !== 100 && req.session.access !== 0) {
    return res.status(403).send('Access denied');
  }

  try {
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

    const userDetailsQuery = `SELECT name, picture FROM users WHERE id = ?`;
    const [userDetails] = await connection.promise().query(userDetailsQuery, [req.session.userId]);

    if (userDetails.length === 0) {
      return res.status(404).send('User not found');
    }

    const profilePic = userDetails[0].picture || '/images/profile/default-profile.jpg';
    req.session.userName = userDetails[0].name;
    req.session.userPicture = profilePic;

    const [totalSubmissionsResult] = await connection.promise().query('SELECT COUNT(*) AS total FROM submission');
    const totalSubmissions = totalSubmissionsResult[0].total;

    const [submissionsByStatusResult] = await connection.promise().query('SELECT status, COUNT(*) AS count FROM submission GROUP BY status');
    const submissionsByStatus = submissionsByStatusResult;

    const [averageTimeToApproveResult] = await connection.promise().query(`
      SELECT AVG(DATEDIFF(date_approuved, date_de_creation)) AS avg_time_to_approve 
      FROM submission 
      WHERE status = 'Demande approuvée'
    `);
    const averageTimeToApprove = Math.round(averageTimeToApproveResult[0].avg_time_to_approve);

    const [monthlySubmissionsResult] = await connection.promise().query(`
      SELECT DATE_FORMAT(date_de_creation, '%Y-%m') AS month, COUNT(*) AS count 
      FROM submission 
      GROUP BY month 
      ORDER BY month
    `);
    const monthlySubmissions = monthlySubmissionsResult;

    const [submissionsByPlatformResult] = await connection.promise().query(`
      SELECT
        'Analyse et Caractérisation des matériaux' AS platform,
        COUNT(*) AS submissions
      FROM submission
      WHERE form_name IN ('form_AZS', 'form_AMCT')

      UNION ALL

      SELECT
        'Analyses Physico-Chimique' AS platform,
        COUNT(*) AS submissions
      FROM submission
      WHERE form_name IN ('form_CHNSO', 'form_SAA', 'form_UV', 'form_TOC', 'form_PIC')

      UNION ALL

      SELECT
        'Laboratoire Biotech' AS platform,
        COUNT(*) AS submissions
      FROM submission
      WHERE form_name IN ('form_AAM', 'form_RDMO')

      UNION ALL

      SELECT
        'Analyse et Caractérisation par Chromatographie' AS platform,
        COUNT(*) AS submissions
      FROM submission
      WHERE form_name = 'form_UHPLC'
    `);
    const submissionsByPlatform = submissionsByPlatformResult;

    const [submissionsByInstitutionResult] = await connection.promise().query(`
      SELECT st.etablissement, COUNT(*) AS count 
      FROM submission s
      JOIN users u ON s.user_id = u.id
      JOIN structure st ON u.structure_id = st.id
      GROUP BY st.etablissement
    `);
    const submissionsByInstitution = submissionsByInstitutionResult;

    const [submissionsByFormResult] = await connection.promise().query('SELECT form_name, COUNT(*) AS count FROM submission GROUP BY form_name');
    const submissionsByForm = submissionsByFormResult.map(row => ({
      name: formNameMap[row.form_name],
      value: row.count
    }));

    // Submissions per platform per month
    const [submissionsPerPlatformPerMonthResult] = await connection.promise().query(`
      SELECT 
        DATE_FORMAT(date_de_creation, '%Y-%m') AS month, 
        CASE 
          WHEN form_name IN ('form_AZS', 'form_AMCT') THEN 'Analyse et Caractérisation des matériaux'
          WHEN form_name IN ('form_CHNSO', 'form_SAA', 'form_UV', 'form_TOC', 'form_PIC') THEN 'Analyses Physico-Chimique'
          WHEN form_name IN ('form_AAM', 'form_RDMO') THEN 'Laboratoire Biotech'
          WHEN form_name = 'form_UHPLC' THEN 'Analyse et Caractérisation par Chromatographie'
        END AS platform,
        COUNT(*) AS count
      FROM submission
      GROUP BY month, platform
      ORDER BY month, platform
    `);
    const submissionsPerPlatformPerMonth = submissionsPerPlatformPerMonthResult;

    // Total submissions for the current month
    const currentMonth = moment().format('YYYY-MM');
    const [currentMonthSubmissionsResult] = await connection.promise().query(`
      SELECT COUNT(*) AS count 
      FROM submission 
      WHERE DATE_FORMAT(date_de_creation, '%Y-%m') = ?
    `, [currentMonth]);
    const currentMonthSubmissions = currentMonthSubmissionsResult[0].count;

    const submissionsByStatusChart = formatChartData(submissionsByStatus, 'status', 'count');
    const monthlySubmissionsChart = formatChartData(monthlySubmissions, 'month', 'count');
    const submissionsByPlatformChart = formatChartData(submissionsByPlatform, 'platform', 'submissions');
    const submissionsByInstitutionChart = formatChartData(submissionsByInstitution, 'etablissement', 'count');
    const submissionsByFormChart = formatChartData(submissionsByForm, 'name', 'value');
    const submissionsPerPlatformPerMonthChart = formatStackedBarChartData(submissionsPerPlatformPerMonth, 'month', 'platform', 'count');

    res.render('plat/admin page/dashboard', {
      name: req.session.userName,
      profilePic: req.session.userPicture,
      totalSubmissions,
      averageTimeToApprove,
      currentMonthSubmissions,
      submissionsByStatusChart: JSON.stringify(submissionsByStatusChart),
      submissionsByPlatformChart: JSON.stringify(submissionsByPlatformChart),
      submissionsByInstitutionChart: JSON.stringify(submissionsByInstitutionChart),
      submissionsByFormChart: JSON.stringify(submissionsByFormChart),
      monthlySubmissionsChart: JSON.stringify(monthlySubmissionsChart),
      submissionsPerPlatformPerMonthChart: JSON.stringify(submissionsPerPlatformPerMonthChart)
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});


router.get('/adminDem', async (req, res) => {
  if (!req.session.userId) {
    return res.status(403).send('Access denied');
  }

  if (req.session.access !== 100 && req.session.access !== 0) {
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

    // Fetch all submission data with user details
    const submissionQuery = `
      SELECT s.id, s.date_de_creation, s.form_name, s.status, s.user_id, u.name as user_name
      FROM submission s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.date_de_creation DESC
    `;
    const [submissions] = await connection.promise().query(submissionQuery);

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

    res.render('plat/admin page/adminDem', {
      name: req.session.userName,
      submissions: formattedSubmissions,
      profilePic: req.session.userPicture,
      access: req.session.access
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});

router.get('/adminUsers', async (req, res) => {
  if (!req.session.userId) {
    return res.status(403).send('Access denied');
  }

  if (req.session.access !== 100 && req.session.access !== 0) {
    return res.status(403).send('Access denied');
  }

  try {
    const userDetailsQuery = `SELECT name, picture FROM users WHERE id = ?`;
    const [userDetails] = await connection.promise().query(userDetailsQuery, [req.session.userId]);

    if (userDetails.length === 0) {
      return res.status(404).send('User not found');
    }

    const profilePic = userDetails[0].picture || '/images/profile/default-profile.jpg';

    req.session.userName = userDetails[0].name;
    req.session.userPicture = profilePic;

    const usersQuery = `
      SELECT id, name, email, access, structure_id, status, phone, picture
      FROM users
      ORDER BY name ASC
    `;
    const [users] = await connection.promise().query(usersQuery);

    const accessMap = {
      1: 'Utilisateur Client',
      4: 'Encadrant',
      5: 'Responsable de laboratoire',
      10: 'Responsable de Plateforme',
      20: 'Responsable de Plateforme',
      30: 'Responsable de Plateforme',
      40: 'Responsable de Plateforme',
      100: 'Administrateur'
    };

    const formattedUsers = users.map(user => ({
      ...user,
      profilePicture: user.picture || '/images/profile/default-profile.jpg',
      accessName: user.status === 'Enseignant chercheur' || user.status === 'Etudiant' ? user.status : accessMap[user.access] || user.access
    }));

    res.render('plat/admin page/adminUsers', {
      name: req.session.userName,
      users: formattedUsers,
      profilePic: req.session.userPicture,
      access: req.session.access
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
    const updateStatusQuery = `UPDATE submission SET status = ? WHERE id = ?`;
    await connection.promise().query(updateStatusQuery, [newStatus, submissionId]);

    res.redirect('/plat/dashboard/adminDem');
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});

router.get('/delete-submission/:id', async (req, res) => {
  const submissionId = req.params.id;
  if (!req.session.userId) {
    return res.status(403).send('Access denied');
  }

  if (req.session.access !== 100 && req.session.access !== 0) {
    return res.status(403).send('Access denied');
  }

  try {
    const deleteQuery = 'DELETE FROM submission WHERE id = ?';
    const [result] = await connection.promise().query(deleteQuery, [submissionId]);

    if (result.affectedRows > 0) {
      console.log('Submission deleted successfully');
    } else {
      console.log('Submission not found');
    }
    res.redirect(req.get('referer'));
  } catch (error) {
    console.error('Database delete error:', error);
    res.status(500).send('Error deleting submission');
  }
});

router.post('/adminUsers/update/:userId', async (req, res) => {
  const { userId } = req.params;
  const { password, access } = req.body;
  const transporter = req.app.get('emailTransporter');

  try {
    // Fetch current user data
    const [currentUser] = await connection.promise().query('SELECT email, access FROM users WHERE id = ?', [userId]);

    if (currentUser.length === 0) {
      return res.status(404).send('User not found');
    }

    const currentEmail = currentUser[0].email;
    const currentAccess = currentUser[0].access;

    // Hash the new password if it is provided
    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Prepare the update query
    const updateUserQuery = `
      UPDATE users
      SET ${hashedPassword ? 'password = ?,' : ''} access = ?
      WHERE id = ?
    `;

    const params = [...(hashedPassword ? [hashedPassword] : []), access || currentAccess, userId];
    await connection.promise().query(updateUserQuery, params);

    // Send an email notification to the user if the password is changed
    if (password) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: currentEmail,
        subject: 'Your Account Information Has Been Updated',
        text: `Cher utilisateur,

Les informations de votre compte ont été mises à jour.
Votre nouveau mot de passe est : ${password}

Si vous n'avez pas demandé cette modification, veuillez contacter immédiatement l'assistance.

Cordialement,
Votre équipe d'assistance`
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).send('Error updating user');
  }
});

router.get('/adminUsers/delete/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the access level of the user to be deleted
    const [user] = await connection.promise().query('SELECT access FROM users WHERE id = ?', [userId]);

    if (user.length === 0) {
      return res.status(404).send('User not found');
    }

    // Check if the user is an admin
    if (user[0].access === 100) {
      return res.status(403).send('Cannot delete an admin user');
    }

    // Proceed with deletion
    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    await connection.promise().query(deleteQuery, [userId]);

    res.redirect('/plat/dashboard/adminUsers');
  } catch (error) {
    console.error('Database delete error:', error);
    res.status(500).send('Error deleting user');
  }
});


router.post('/adminUsers/create', async (req, res) => {
  const { name, email, password, access } = req.body;
  const transporter = req.app.get('emailTransporter');

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createUserQuery = `
      INSERT INTO users (name, email, password, access, picture)
      VALUES (?, ?, ?, ?, '/images/profile/default-profile.jpg')
    `;
    await connection.promise().query(createUserQuery, [name, email, hashedPassword, access]);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Informations sur votre nouveau compte',
      text: `Cher/Chère ${name},

Votre compte a été créé sur le Portail des demandes d'analyses de la Cité de l'Innovation de Marrakech.
Votre email est : ${email}
Votre mot de passe est : ${password}

Veuillez modifier votre mot de passe après votre première connexion.

Cordialement,
Votre équipe d'assistance`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send('User created successfully');
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).send('Error creating user');
  }
});






router.get('/adminStats', async (req, res) => {
  if (!req.session.userId) {
    return res.status(403).send('Access denied');
  }

  if (req.session.access !== 100 && req.session.access !== 0) {
    return res.status(403).send('Access denied');
  }

  try {
    const submissionStatsResponse = await fetch('http://localhost:5000/api/submission-stats');
    if (!submissionStatsResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const submissionStats = await submissionStatsResponse.json();

    res.render('plat/dashboard', {
      submissionStats
    });
  } catch (error) {
    console.error('Error fetching data from AI API:', error);
    res.status(500).send('Internal server error');
  }
});



module.exports = router;
