const express = require('express');
const bodyParser = require('body-parser');
const db = require('./functions/data').db

//test connection to db
db.authenticate()
    .then(()=> console.log('Database connected'))
    .catch(err => console.log('Error ', err.message))

//initializing app
const app = express();

//initializing handlebars
const pug = require('pug')
app.set('view engine', pug);

//settings of authorization
const cookieParser = require('cookie-parser')
const passport = require('passport')
require('./functions/auth')
app.use(require('express-session')({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

//routes
app.use('/', require('./routes/index'));

//launch server
const server = app.listen(5000, (error) => {
  if (error) {
    return console.log(`Error: ${error}`);
  }
  console.log(`Server listening on port ${server.address().port}`);
});

module.exports = app;