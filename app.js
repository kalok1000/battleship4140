var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.use('/users', users);


app.get('/',function(request,response){
    response.sendFile(__dirname+'/views/index.html');
})
app.get('/login',function(request,response){
    response.sendFile(__dirname+'/views/login.html');
})
app.get('/register',function(request,response){
    response.sendFile(__dirname+'/views/register.html');
})
app.get('/lobby',function(request,response){
    response.sendFile(__dirname+'/views/lobby.html');
})
app.get('/boardsetting',function(request,response){
    response.sendFile(__dirname+'/views/boardsetting.html');
})
app.get('/battleship',function(request,response){
    response.sendFile(__dirname+'/views/battleship.html');
})
app.get('/2',function(request,response){
    response.sendFile(__dirname+'/views/index2.html');
})

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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
