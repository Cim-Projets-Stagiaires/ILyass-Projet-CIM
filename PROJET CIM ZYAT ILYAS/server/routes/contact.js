const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

// Use body-parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// GET route for rendering the contact form page
router.get('/', function(req, res, next) {
  res.render('site/contact', { title: 'CIM' });
});

// POST route for submitting the contact form
router.post('/submit-form', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;


    const mailOptions = {
        from: email,
        to: 'letexte2001@gmail.com',
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            // Respond with an error status code and message
            res.status(500).send('An error occurred while sending the email.');
        } else {
            console.log('Email sent: ' + info.response);
            // Redirect to the contact page after sending the email
            res.redirect('/contact');
        }
    });

    // Schedule the reminder email to be sent at 9 am
    const reminderDate = new Date();
    reminderDate.setHours(9, 0, 0, 0); // Set reminder time to 9:00 am

    // Schedule the reminder email
    const reminderJob = schedule.scheduleJob(reminderDate, function(){
        // Configure and send the reminder email
        const reminderMailOptions = {
            from: 'letexte2001@gmail.com',
            to: email,
            subject: 'Reminder: Follow Up on Your Message',
            text: `Dear ${name},\n\nThis is a friendly reminder to follow up on your message sent to us earlier.\n\nRegards,\nThe CIM Team`
        };

        transporter.sendMail(reminderMailOptions, (error, info) => {
            if (error) {
                console.log('Error sending reminder email:', error);
            } else {
                console.log('Reminder email sent:', info.response);
            }
        });
    });
});

// Export the router
module.exports = router;
