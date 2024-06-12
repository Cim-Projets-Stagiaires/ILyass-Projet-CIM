
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const app = express();
const multer = require('multer');
require('dotenv').config()
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.set('emailTransporter', transporter);


const hbs = expressHandlebars.create({
  handlebars: allowInsecurePrototypeAccess(require('handlebars')),
  defaultLayout: 'layout',
  extname: '.hbs',
  helpers: {
    eq: (v1, v2) => v1 === v2,
    subtract: (a, b) => a - b,
    add: (a, b) => a + b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
    range: (start, end) => {
      let range = [];
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    },
    isSelected: (actValue, selectedActes) => {
      return Array.isArray(selectedActes) && selectedActes.includes(actValue) ? 'checked' : '';
    },
    isChecked: (acteValue, actesColumn) => {
      if (!actesColumn) return '';
      const actesArray = actesColumn.split(', ');
      return actesArray.includes(acteValue) ? 'checked' : '';
    },
    getStatusClass: (status) => {
      switch (status) {
        case 'Demande déposée':
          return 'status-deposee';
        case 'Demande reçue':
          return 'status-recue';
        case 'Demande annulée':
          return 'status-annulee';
        case 'Demande approuvée':
          return 'status-approuvee';
        case 'Demande refusée':
        return 'status-refusee';
        case 'Echantillion demandé':
          return 'status-demande';
        case 'Echantillion déposé':
          return 'status-depose';
        case 'Résultat partiel':
          return 'status-partiel';
        case 'Résultat final':
          return 'status-final';
        case 'Clôturé':
          return 'status-cloture';
        default:
          return '';
      }
    },
    json: context => JSON.stringify(context)
  }
});





app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');


app.set('views', path.join(__dirname, 'views'));


app.use(session({
  secret: 'secretCIM',
  resave: false,
  saveUninitialized: true,
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





const indexRouter = require('./routes/index');
const polesRouter = require('./routes/poles');
const servicesRouter = require('./routes/services');
const videoRouter = require('./routes/video');
const contactRouter = require('./routes/contact');
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const panelRouter = require('./routes/panel');
const respo_strucRouter = require('./routes/respo_struc');
const gest_platRouter = require('./routes/gest_plat');
const formRouter = require('./routes/formulaire');
const editFormRouter = require('./routes/editForm');
const editProfileRouter = require('./routes/editProfile');
const plateformeRouter = require('./routes/plateforme');
const viewFormRouter = require('./routes/viewForm');
const logoutRouter = require('./routes/logout');



app.use('/', indexRouter);
app.use('/poles', polesRouter);
app.use('/services', servicesRouter);
app.use('/video', videoRouter);
app.use('/contact', contactRouter);
app.use('/auth', authRouter);
app.use('/plat/dashboard', dashboardRouter);
app.use('/plat/panel', panelRouter);
app.use('/plat/respo_struc', respo_strucRouter);
app.use('/plat/gest_plat', gest_platRouter);
app.use('/plat/formulaire', formRouter);
app.use('/plat/panel/edit-form', editFormRouter);
app.use('/editProfile', editProfileRouter);
app.use('/plat/plateforme', plateformeRouter);
app.use('/plat/view-form', viewFormRouter);
app.use('/', logoutRouter);





app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
