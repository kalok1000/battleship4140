var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var assert = require('assert');

var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://milk:y5071826@ds035703.mlab.com:35703/battleship';

/*mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uristring);
    }
});*/

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

app.use('/', routes);
app.use('/users', users);

app.get("/:id([0-9]+)/ship/",function(req,res,next){
	 if(!req.cookies.roomId){
		 res.cookie('roomId', req.params.id, {maxAge: 60 * 1000});
	 }
	res.sendFile(path.resolve(__dirname + '/views/ship_arrange.html'));
});

app.get("/:id([0-9]+)/battle/",function(req,res,next){
	res.sendFile(path.resolve(__dirname + '/views/battle.html'));
});

app.get('/',function(request,response){
    response.sendFile(__dirname+'/views/index.html');
});
app.get('/login',function(request,response){
    response.sendFile(__dirname+'/views/login.html');
});
app.get('/register',function(request,response){
    response.sendFile(__dirname+'/views/register.html');
});
app.get('/lobby',function(request,response){
    response.sendFile(__dirname+'/views/lobby.html');
});
app.get('/boardsetting',function(request,response){
    response.sendFile(__dirname+'/views/boardsetting.html');
});
app.get('/battleship',function(request,response){
    response.sendFile(__dirname+'/views/battleship.html');
});
app.get('/test', function(request, response){
    response.sendFile(__dirname+'/views/test.html');
});

var Schema = new mongoose.Schema({
    username : {type: String, unique: true},
    password : String,
    email: String
});

var user = mongoose.model('user-data',Schema);

app.post('/try', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    mongo.connect(uristring, function(err,db) {
        assert.equal(null, err);
        db.collection('user-data').findOne({username: username, password: password}, function(err, obj) {
          assert.equal(null,err);
          if(!obj){
              //console.log("Incorrect username or password");
              // res.redirect('/');
              res.status(404);
              res.json({error: "Incorrect username or password"});
          }
          else {
              //res.redirect('lobby');
              res.json(obj);
          }
        });
    });
});

app.post('/online', function(req, res) {
    var myCursor;
    var result = []; 
    mongo.connect(uristring, function(err,db) {
        assert.equal(null, err);
        myCursor = db.collection('user-data').find();

        console.log(myCursor);
        db.close();
    });
    res.json(result);
});

app.post('/new', function(req,res, next){
    var user = {
        username : req.body.username,
        password : req.body.password,
        email : req.body.email
    };
    var username = req.body.username;
    //res.json(user);

    mongo.connect(uristring, function(err,db) {
        assert.equal(null, err);
        db.collection('user-data').findOne({username: username}, function(err, obj) {
            if(!obj) {
              db.collection('user-data').insertOne(user, function(err, result) {
                  assert.equal(null, err);
                  db.close();
                  res.redirect('/');
              });
            } else {
              db.close();
              res.status(404);
              res.json({error: "Username has been used"});
            }
        });
    });
});

app.post('/logout', function(req, res, next) {
    res.redirect('/');
});

// app.post('/new', function(req,res){
//     var username = req.body.username;
//     console.log(username);
// })

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
