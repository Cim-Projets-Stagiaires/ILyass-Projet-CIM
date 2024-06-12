const express = require('express');
const router = express.Router();
const connection = require('../connection.js');

router.get('/', (req, res) => {
  const formType = req.query.type;
  console.log(formType);
  connection.query('SELECT name FROM structure', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database query error');
    } else {
      res.render('plat/formulaire', {
        formType: formType
      });
    }
  });
});


router.post('/submit-AZS', async (req, res) => {
  const { nbr_ech, nbr_rep, nature, solvant, toxicite, type, ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, conditions_stock, recuperation_echantillon } = req.body;
  const userId = req.session.userId; 
  const currentYear = new Date().getFullYear().toString().slice(-2); 
  const formPrefix = 'AZS'; 

  try {
    const lastCodeQuery = `SELECT code FROM form_AZS WHERE code LIKE '${currentYear}-${formPrefix}-%' ORDER BY id DESC LIMIT 1`;
    const [lastCodeResult] = await connection.promise().query(lastCodeQuery);
    const lastCode = lastCodeResult[0] ? parseInt(lastCodeResult[0].code.split('-')[2]) + 1 : 1;
    const formCode = `${currentYear}-${formPrefix}-${lastCode.toString().padStart(2, '0')}`;


    const submissionQuery = `
        INSERT INTO submission (user_id, form_name, date_de_creation, conditions_stock, recup)
        VALUES (?, 'form_AZS', NOW(), ?, ?)
    `;
    const [submissionResult] = await connection.promise().query(submissionQuery, [userId, conditions_stock, recuperation_echantillon]);
    const submissionId = submissionResult.insertId;


    const formAZSQuery = `
        INSERT INTO form_AZS (submission_id, code, nbr_ech, nbr_rep, nature, solvant, toxicite, type, 
                              ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.promise().query(formAZSQuery, [submissionId, formCode, nbr_ech, nbr_rep, nature, solvant, toxicite, 
                                                    type, ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4]);
    res.redirect('/plat/panel');
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send("Server error occurred.");
  }
});

router.post('/submit-AMCT', async (req, res) => {
  const {
    nbr_ech, nature, toxicite, etat_ech, temperature,
    ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10,
    conditions_stock, recuperation_echantillon
  } = req.body;
  const userId = req.session.userId;
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const formPrefix = 'AMCT';

  try {
    const lastCodeQuery = `SELECT code FROM form_AMCT WHERE code LIKE '${currentYear}-${formPrefix}-%' ORDER BY id DESC LIMIT 1`;
    const [lastCodeResult] = await connection.promise().query(lastCodeQuery);
    const lastCode = lastCodeResult[0] ? parseInt(lastCodeResult[0].code.split('-')[2]) + 1 : 1;
    const formCode = `${currentYear}-${formPrefix}-${lastCode.toString().padStart(2, '0')}`;


    const submissionQuery = `
        INSERT INTO submission (user_id, form_name, date_de_creation, conditions_stock, recup)
        VALUES (?, ?, NOW(), ?, ?)
    `;
    const [submissionResult] = await connection.promise().query(submissionQuery, [userId, 'form_AMCT', conditions_stock, recuperation_echantillon]);
    const submissionId = submissionResult.insertId;


    const formAMCTQuery = `
        INSERT INTO form_AMCT (submission_id, code, nbr_ech, nature, toxicite, etat_ech, temperature,
                               ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.promise().query(formAMCTQuery, [
      submissionId, formCode, nbr_ech, nature, toxicite, etat_ech, temperature,
      ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10
    ]);
    res.redirect('/plat/panel');
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send("Server error occurred.");
  }
});

router.post('/submit-AAM', async (req, res) => {
  const { mtd_sld, act_sld, mtd_lqd, act_lqd, germes, autres_details, validation, validation_details } = req.body;
  const userId = req.session.userId;
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const formPrefix = 'AAM';


  const actSldValue = Array.isArray(act_sld) ? act_sld.join(',') : (act_sld || '');
  const actLqdValue = Array.isArray(act_lqd) ? act_lqd.join(',') : (act_lqd || '');
  const germesValue = Array.isArray(germes) ? germes.join(',') : (germes || '');

  try {
    const lastCodeQuery = `SELECT code FROM form_AAM WHERE code LIKE '${currentYear}-${formPrefix}-%' ORDER BY id DESC LIMIT 1`;
    const [lastCodeResult] = await connection.promise().query(lastCodeQuery);
    const lastCode = lastCodeResult[0] ? parseInt(lastCodeResult[0].code.split('-')[2]) + 1 : 1;
    const formCode = `${currentYear}-${formPrefix}-${lastCode.toString().padStart(2, '0')}`;

    const submissionQuery = `
        INSERT INTO submission (user_id, form_name, date_de_creation)
        VALUES (?, 'form_AAM', NOW())
    `;
    const [submissionResult] = await connection.promise().query(submissionQuery, [userId]);
    const submissionId = submissionResult.insertId;

    const formAAMQuery = `
        INSERT INTO form_AAM (submission_id, code, mtd_sld, act_sld, mtd_lqd, act_lqd, germes, autres_details, validation, validation_details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [formAAMResult] = await connection.promise().query(formAAMQuery, [submissionId, formCode, mtd_sld, actSldValue, mtd_lqd, actLqdValue, germesValue, autres_details, validation, validation_details]);
    const formAAMId = formAAMResult.insertId;

    for (let i = 1; i <= 10; i++) { 
      const nature = req.body[`nature${i}`];
      const nature_details = req.body[`details-nature${i}`];
      const etat = req.body[`etat${i}`];
      const condition_stock = req.body[`condition_stock${i}`];

      if (nature) {  
        const echAAMQuery = `INSERT INTO ech_AAM (form_AAM_id, nature, nature_details, etat, condition_stock) VALUES (?, ?, ?, ?, ?)`;
        await connection.promise().query(echAAMQuery, [formAAMId, nature, nature_details, etat, condition_stock]);
      }
    }

    res.redirect('/plat/panel');
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send("Server error occurred.");
  }
});

router.post('/submit-RDMO', async (req, res) => {
  const userId = req.session.userId;
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const formPrefix = 'RDMO';

  try {
    const lastCodeQuery = `SELECT code FROM form_RDMO WHERE code LIKE '${currentYear}-${formPrefix}-%' ORDER BY id DESC LIMIT 1`;
    const [lastCodeResult] = await connection.promise().query(lastCodeQuery);
    const lastCode = lastCodeResult[0] ? parseInt(lastCodeResult[0].code.split('-')[2]) + 1 : 1;
    const formCode = `${currentYear}-${formPrefix}-${lastCode.toString().padStart(2, '0')}`;

    const submissionQuery = `
        INSERT INTO submission (user_id, form_name, date_de_creation)
        VALUES (?, 'form_RDMO', NOW())
    `;
    const [submissionResult] = await connection.promise().query(submissionQuery, [userId]);
    const submissionId = submissionResult.insertId;

    const formRDMOQuery = `
        INSERT INTO form_RDMO (submission_id, code)
        VALUES (?, ?)
    `;
    const [formRDMOResult] = await connection.promise().query(formRDMOQuery, [submissionId, formCode]);
    const formRDMOId = formRDMOResult.insertId;

    for (let i = 1; i <= 10; i++) {
      const nature = req.body[`nature${i}`];
      const nature_details = req.body[`details-nature${i}`];
      const etat = req.body[`etat${i}`];
      const condition_stock = req.body[`condition_stock${i}`];
      const analysesArray = req.body[`analyses${i}`];

      const analysesValue = Array.isArray(analysesArray) ? analysesArray.join(',') : (analysesArray || '');

      if (nature) {

        console.log(`details-nature${i}:`, nature_details);



        const echRDMOQuery = `
          INSERT INTO ech_RDMO (form_RDMO_id, nature, nature_details, etat, condition_stock, analyses)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await connection.promise().query(echRDMOQuery, [formRDMOId, nature, nature_details, etat, condition_stock, analysesValue]);
      }
    }

    res.redirect('/plat/panel');
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send("Server error occurred.");
  }
});

router.post('/submit-CHNSO', async (req, res) => {
  const { type, nbr_ech, nbr_rep, nature, details_nature, Toxicité, ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, config, elm, conditions_stock, recuperation_echantillon } = req.body;
  const userId = req.session.userId; 
  const currentYear = new Date().getFullYear().toString().slice(-2); 
  const formPrefix = 'CHNSO'; 

  try {
    const lastCodeQuery = `SELECT code FROM form_chnso WHERE code LIKE '${currentYear}-${formPrefix}-%' ORDER BY id DESC LIMIT 1`;
    const [lastCodeResult] = await connection.promise().query(lastCodeQuery);
    const lastCode = lastCodeResult[0] ? parseInt(lastCodeResult[0].code.split('-')[2]) + 1 : 1;
    const formCode = `${currentYear}-${formPrefix}-${lastCode.toString().padStart(2, '0')}`;

    const submissionQuery = `
        INSERT INTO submission (user_id, form_name, date_de_creation, conditions_stock, recup)
        VALUES (?, 'form_CHNSO', NOW(), ?, ?)
    `;
    const [submissionResult] = await connection.promise().query(submissionQuery, [userId, conditions_stock, recuperation_echantillon]);
    const submissionId = submissionResult.insertId;

    const formCHNSOQuery = `
        INSERT INTO form_chnso (submission_id, code, type, nbr_ech, nbr_rep, nature, details_nature, Toxicité, ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, config, elm)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.promise().query(formCHNSOQuery, [submissionId, formCode, type, nbr_ech, nbr_rep, nature, details_nature, Toxicité, ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, config, elm]);

    res.redirect('/plat/panel');
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send("Server error occurred.");
  }
});

router.post('/submit-SAA', async (req, res) => {
  const {
    type, system, nbr_ech, nbr_rep, nature, details_nature, Toxicité, ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, mtd_prep, elm, conditions_stock, recuperation_echantillon
  } = req.body;
  const userId = req.session.userId; 
  const currentYear = new Date().getFullYear().toString().slice(-2); 
  const formPrefix = 'SAA'; 

  try {
    const lastCodeQuery = `SELECT code FROM form_saa WHERE code LIKE '${currentYear}-${formPrefix}-%' ORDER BY id DESC LIMIT 1`;
    const [lastCodeResult] = await connection.promise().query(lastCodeQuery);
    const lastCode = lastCodeResult[0] ? parseInt(lastCodeResult[0].code.split('-')[2]) + 1 : 1;
    const formCode = `${currentYear}-${formPrefix}-${lastCode.toString().padStart(2, '0')}`;

    const submissionQuery = `
        INSERT INTO submission (user_id, form_name, date_de_creation, conditions_stock, recup)
        VALUES (?, 'form_SAA', NOW(), ?, ?)
    `;
    const [submissionResult] = await connection.promise().query(submissionQuery, [userId, conditions_stock, recuperation_echantillon]);
    const submissionId = submissionResult.insertId;

    const formSAAQuery = `
        INSERT INTO form_saa (submission_id, code, type, system, nbr_ech, nbr_rep, nature, details_nature, Toxicité, ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, mtd_prep, elm)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.promise().query(formSAAQuery, [submissionId, formCode, type, system, nbr_ech, nbr_rep, nature, details_nature, Toxicité, ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, mtd_prep, elm]);

    res.redirect('/plat/panel');
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send("Server error occurred.");
  }
});

router.post('/submit-UV', async (req, res) => {
  const { nbr_ech, nbr_rep, nature, etat, Toxicité, cond_alys, ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, ref_ech_11, ref_ech_12, ref_ech_13, ref_ech_14, ref_ech_15, conditions_stock, recuperation_echantillon } = req.body;
  const userId = req.session.userId; 
  const currentYear = new Date().getFullYear().toString().slice(-2); 
  const formPrefix = 'UV'; 

  try {
    const lastCodeQuery = `SELECT code FROM form_uv WHERE code LIKE '${currentYear}-${formPrefix}-%' ORDER BY id DESC LIMIT 1`;
    const [lastCodeResult] = await connection.promise().query(lastCodeQuery);
    const lastCode = lastCodeResult[0] ? parseInt(lastCodeResult[0].code.split('-')[2]) + 1 : 1;
    const formCode = `${currentYear}-${formPrefix}-${lastCode.toString().padStart(2, '0')}`;

    const submissionQuery = `
        INSERT INTO submission (user_id, form_name, date_de_creation, conditions_stock, recup)
        VALUES (?, 'form_UV', NOW(), ?, ?)
    `;
    const [submissionResult] = await connection.promise().query(submissionQuery, [userId, conditions_stock, recuperation_echantillon]);
    const submissionId = submissionResult.insertId;

    const formUVQuery = `
        INSERT INTO form_uv (submission_id, code, nbr_ech, nbr_rep, nature, etat, Toxicité, cond_alys, ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, ref_ech_11, ref_ech_12, ref_ech_13, ref_ech_14, ref_ech_15)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Handle cond_alys as a set
    const condAlysValue = Array.isArray(cond_alys) ? cond_alys.join(',') : (cond_alys || '');

    await connection.promise().query(formUVQuery, [submissionId, formCode, nbr_ech, nbr_rep, nature, etat, Toxicité, condAlysValue, ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, ref_ech_11, ref_ech_12, ref_ech_13, ref_ech_14, ref_ech_15]);

    res.redirect('/plat/panel');
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send("Server error occurred.");
  }
});

router.post('/submit-TOC', async (req, res) => {
  const {
    nom, type, nbr_ech, nbr_rep, nature, details_nature, conditionnement, conductivité, Toxicité,
    ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10,
    mtd_prep, conditions_stock, recuperation_echantillon
  } = req.body;
  const userId = req.session.userId;
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const formPrefix = 'TOC';

  try {
    const lastCodeQuery = `SELECT code FROM form_toc WHERE code LIKE '${currentYear}-${formPrefix}-%' ORDER BY id DESC LIMIT 1`;
    const [lastCodeResult] = await connection.promise().query(lastCodeQuery);
    const lastCode = lastCodeResult[0] ? parseInt(lastCodeResult[0].code.split('-')[2]) + 1 : 1;
    const formCode = `${currentYear}-${formPrefix}-${lastCode.toString().padStart(2, '0')}`;

    const submissionQuery = `
        INSERT INTO submission (user_id, form_name, date_de_creation, conditions_stock, recup)
        VALUES (?, 'form_TOC', NOW(), ?, ?)
    `;
    const [submissionResult] = await connection.promise().query(submissionQuery, [userId, conditions_stock, recuperation_echantillon]);
    const submissionId = submissionResult.insertId;

    const formTOCQuery = `
        INSERT INTO form_toc (submission_id, code, nom, type, nbr_ech, nbr_rep, nature, details_autre, conditionnement, conductivité, Toxicité,
                              ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, mtd_prep)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.promise().query(formTOCQuery, [submissionId, formCode, nom, type, nbr_ech, nbr_rep, nature, details_nature, conditionnement, conductivité, Toxicité,
                                                    ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, mtd_prep]);

    res.redirect('/plat/panel');
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send("Server error occurred.");
  }
});

router.post('/submit-PIC', async (req, res) => {
  const {
    nbr_ech, Toxicité, desc, conditions_stock, recuperation_echantillon,
  } = req.body;
  const userId = req.session.userId;
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const formPrefix = 'PICARRO';

  try {
    const lastCodeQuery = `SELECT code FROM form_pic WHERE code LIKE '${currentYear}-${formPrefix}-%' ORDER BY id DESC LIMIT 1`;
    const [lastCodeResult] = await connection.promise().query(lastCodeQuery);
    const lastCode = lastCodeResult[0] ? parseInt(lastCodeResult[0].code.split('-')[2]) + 1 : 1;
    const formCode = `${currentYear}-${formPrefix}-${lastCode.toString().padStart(2, '0')}`;

    const submissionQuery = `
        INSERT INTO submission (user_id, form_name, date_de_creation, conditions_stock, recup)
        VALUES (?, 'form_PIC', NOW(), ?, ?)
    `;
    const [submissionResult] = await connection.promise().query(submissionQuery, [userId, conditions_stock, recuperation_echantillon]);
    const submissionId = submissionResult.insertId;

    const formPICQuery = `
        INSERT INTO form_pic (submission_id, code, nbr_ech, Toxicité, \`desc\`)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [formPICResult] = await connection.promise().query(formPICQuery, [submissionId, formCode, nbr_ech, Toxicité, desc]);
    const formPICId = formPICResult.insertId;

    for (let i = 1; i <= nbr_ech; i++) {
      const sampleNature = req.body[`nature${i}`];
      const sampleDate = req.body[`date${i}`];
      const sampleTemp = req.body[`temp${i}`];
      const sampleCoord = req.body[`coord${i}`];
      const sampleConductivité = req.body[`conductivité${i}`];
      const samplePh = req.body[`ph${i}`];

      if (sampleNature && sampleDate && sampleTemp && sampleCoord && sampleConductivité && samplePh) {
        const echPICQuery = `
          INSERT INTO ech_pic (form_PIC_id, nature, date, temp, coord, conductivité, ph)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.promise().query(echPICQuery, [formPICId, sampleNature, sampleDate, sampleTemp, sampleCoord, sampleConductivité, samplePh]);
      }
    }

    res.redirect('/plat/panel');
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send("Server error occurred.");
  }
});


router.post('/submit-UHPLC', async (req, res) => {
  const {
    type, molécules, nbr_ech, nbr_rep, nature, Toxicité, solubles, slv_a, slv_b, debit, lgr_onde, volume, temp_ech, temp_cln, gradient,
    ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10,
    ref_ech_11, ref_ech_12, ref_ech_13, ref_ech_14, ref_ech_15, ref_ech_16, ref_ech_17, ref_ech_18, conditions_stock, recuperation_echantillon
  } = req.body;
  const userId = req.session.userId;
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const formPrefix = 'UHPLC';

  try {
    const lastCodeQuery = `SELECT code FROM form_uhplc WHERE code LIKE '${currentYear}-${formPrefix}-%' ORDER BY id DESC LIMIT 1`;
    const [lastCodeResult] = await connection.promise().query(lastCodeQuery);
    const lastCode = lastCodeResult[0] ? parseInt(lastCodeResult[0].code.split('-')[2]) + 1 : 1;
    const formCode = `${currentYear}-${formPrefix}-${lastCode.toString().padStart(2, '0')}`;

    const submissionQuery = `
        INSERT INTO submission (user_id, form_name, date_de_creation, conditions_stock, recup)
        VALUES (?, 'form_UHPLC', NOW(), ?, ?)
    `;
    const [submissionResult] = await connection.promise().query(submissionQuery, [userId, conditions_stock, recuperation_echantillon]);
    const submissionId = submissionResult.insertId;

    const formUHPLCQuery = `
        INSERT INTO form_uhplc (submission_id, code, type, nature, molécules, Toxicité, nbr_ech, nbr_rep, solubles, slv_a, slv_b, debit, lgr_onde, volume, temp_ech, temp_cln, gradient,
                               ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, ref_ech_11, ref_ech_12, ref_ech_13, ref_ech_14, ref_ech_15, ref_ech_16, ref_ech_17, ref_ech_18)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [formUHPLCResult] = await connection.promise().query(formUHPLCQuery, [submissionId, formCode, type, nature, molécules, Toxicité, nbr_ech, nbr_rep, solubles, slv_a, slv_b, debit, lgr_onde, volume, temp_ech, temp_cln, gradient,
                                                                                  ref_ech_1, ref_ech_2, ref_ech_3, ref_ech_4, ref_ech_5, ref_ech_6, ref_ech_7, ref_ech_8, ref_ech_9, ref_ech_10, ref_ech_11, ref_ech_12, ref_ech_13, ref_ech_14, ref_ech_15, ref_ech_16, ref_ech_17, ref_ech_18]);
    const formUHPLCId = formUHPLCResult.insertId;

    for (let i = 1; i <= 14; i++) {
      const sampleTemps = req.body[`temps_${i}`];
      const sampleB = req.body[`B_${i}`];

      if (sampleTemps && sampleB) {
        const tempUHPLCQuery = `
          INSERT INTO temp_uhplc (form_UHPLC_id, temps, B)
          VALUES (?, ?, ?)
        `;
        await connection.promise().query(tempUHPLCQuery, [formUHPLCId, sampleTemps, sampleB]);
      }
    }

    res.redirect('/plat/panel');
  } catch (error) {
    console.error("Database operation failed:", error);
    res.status(500).send("Server error occurred.");
  }
});









router.post('/submit', (req, res) => {
  const userId = req.session.userId;
  const { name, type, nbr_ech, nbr_rep, nature, molecule, molecule_precise, toxicite, conditions_stock, structure_name, recuperation_echantillon, actes } = req.body;

  if (!['oui', 'non'].includes(recuperation_echantillon)) {
    return res.status(400).send('Please select an option for recuperation_echantillon.');
  }

  connection.query('SELECT id FROM structure WHERE name = ?', [structure_name], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving structure');
    } else if (results.length > 0) {
      const structureId = results[0].id;

      let selectedActes = Array.isArray(req.body.actes) ? req.body.actes : [req.body.actes];
      const actesPrices = {
        "Spectrophotometre d'absorption atomique": 750,
        "Spectrophotometre a UV": 700,
        "Physico chimie de l'eau": 800,
        "Physico chimie des aliments": 800,
        "Calorimetrie": 675,
      };

      if (!selectedActes || selectedActes.length === 0) {
        return res.status(400).send('At least one acte must be selected.');
      }

      let totalPrice = selectedActes.reduce((sum, acte) => {
        let price = actesPrices[acte];
        if (price) {
          return sum + price;
        } else {
          console.error(`Price not found for acte: ${acte}`);
          return sum;
        }
      }, 0);
      
      console.log('Calculated Total Price:', totalPrice);
      
      if (totalPrice === null || totalPrice === undefined) {
        return res.status(400).send('Invalid total price calculated.');
      }

      connection.query('INSERT INTO form (name, type, nbr_ech, nbr_rep, nature, molecule, molecule_precise, toxicite, conditions_stock, prix, user_id, structure_id, status, recup, actes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, type, nbr_ech, nbr_rep, nature, molecule, molecule_precise, toxicite, conditions_stock, totalPrice, userId, structureId, 'Demande reçue', recuperation_echantillon, selectedActes.join(', ')],
        (insertError, insertResults) => {
          if (insertError) {
            console.error('Insert Error:', insertError);
            res.status(500).send('Error saving form data');
          } else {
            res.redirect('/plat/panel');
          }
        }
      );
    }
  });
});

module.exports = router;
