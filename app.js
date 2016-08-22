var express = require('express');
var cors = required('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var monngose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./lib/config')
var auth_middleware = require('./lib/middleware/auth')

var app = express();

monngose.createConnection(config.database);
// monngose.connect(config.database);

var index = require('./routes/index')
var movie = require('./routes/movie')

var user = require('./routes/user')
var auth = require('./routes/auth')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors);

// Rutas inseguras
app.use('/', index)
app.use('/user', user)
app.use('/auth', auth)

// Middleware
app.use(auth_middleware);

// Rutas Seguras
app.use('/movie', movie)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});


module.exports = app;
