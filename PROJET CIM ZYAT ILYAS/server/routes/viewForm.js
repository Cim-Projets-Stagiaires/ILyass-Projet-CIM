const express = require('express');
const router = express.Router();
const connection = require('../connection.js');


router.get('/form-infos/:formName/:submissionId', async (req, res) => {
  const { formName, submissionId } = req.params;

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

    res.json({
      formDetails: formResult[0],
      submission: submissionResult[0],
      user: userResult[0],
      structure: structureResult[0]
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal server error');
  }
});


router.get('/form_AZS/:submissionId', async (req, res) => {
  const { submissionId } = req.params;
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

    const formQuery = `SELECT * FROM form_azs WHERE submission_id = ?`;
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
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formattedSubmission = {
      ...submissionResult[0],
      date_de_creation: formatDate(submissionResult[0].date_de_creation)
    };

    res.render('plat/viewForm/view_AZS', {
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

router.get('/form_AMCT/:submissionId', async (req, res) => {
  const { submissionId } = req.params;
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

    const formQuery = `SELECT * FROM form_amct WHERE submission_id = ?`;
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
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formattedSubmission = {
      ...submissionResult[0],
      date_de_creation: formatDate(submissionResult[0].date_de_creation)
    };

    res.render('plat/viewForm/view_AMCT', {
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

router.get('/form_CHNSO/:submissionId', async (req, res) => {
  const { submissionId } = req.params;
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

    const formQuery = `SELECT * FROM form_CHNSO WHERE submission_id = ?`;
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
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formattedSubmission = {
      ...submissionResult[0],
      date_de_creation: formatDate(submissionResult[0].date_de_creation)
    };

    res.render('plat/viewForm/view_CHNSO', {
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

router.get('/form_SAA/:submissionId', async (req, res) => {
  const { submissionId } = req.params;
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

    const formQuery = `SELECT * FROM form_saa WHERE submission_id = ?`;
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
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formattedSubmission = {
      ...submissionResult[0],
      date_de_creation: formatDate(submissionResult[0].date_de_creation)
    };

    res.render('plat/viewForm/view_SAA', {
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






module.exports = router;
