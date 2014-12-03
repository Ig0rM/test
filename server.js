var express       = require('express');
var app           = express();
// var routes        = require('./backend/routes.js');
// var passportConf  = require('./backend/passport');
var bodyParser    = require('body-parser');

// var mongoose      = require('mongoose');
var passport      = require('passport');
var flash         = require('connect-flash');

var morgan        = require('morgan');
var session       = require('express-session');

// var configDB      = require('./backend/connection.js');

// mongoose.connect(configDB.dbUrl);//
// passportConf.conf(passport);

app.use(morgan('dev'));//

app.use(bodyParser());

app.set('view engine', 'ejs'); //
// app.set('views',__dirname + '/templates');

// required for passport
app.use(session({ secret: 'lblog' })); // session secret
// app.use(passport.initialize()); 
// app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes.createRoutes(app, passport);

module.exports = app;