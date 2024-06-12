const express = require('express');
const router = express.Router();
const connection = require('../connection.js'); // Make sure the path is correct for your setup

// Defined types for the dropdown menu
const allTypes = ['Labs', 'Equipes', 'Centres'];



// Handler to fetch and display the edit form page
router.get('/:id', async (req, res) => {
  try {
    const formId = req.params.id;
    const formQuery = 'SELECT * FROM form WHERE id = ?';
    const [forms] = await connection.promise().query(formQuery, [formId]);

    if (forms.length === 0) {
      return res.status(404).send('Form not found');
    }


    const actesQuery = 'SELECT actes FROM form WHERE id = ?';
    const [actesResult] = await connection.promise().query(actesQuery, [formId]);

    const form = forms[0];
    const selectedActes = actesResult[0].actes.split(', ');

    // Get structures related to the current form type
    const structuresQuery = 'SELECT id, name FROM structure WHERE type = ?';
    const [relatedStructures] = await connection.promise().query(structuresQuery, [form.type]);



    // Render the edit form with the current form data and related structures
    res.render('plat/editForm', {
      form: form,
      allStructures: relatedStructures,
      allTypes: allTypes,
      currentType: form.type,
      selectedActes: selectedActes
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error while retrieving form details');
  }
});

// Route to dynamically load structures based on the selected type
router.get('/structures/:type', (req, res) => {
  const { type } = req.params;
  connection.query('SELECT id, name FROM structure WHERE type = ?', [type], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database query error');
    }
    res.json(results);
  });
});

module.exports = router;
