var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var application_controller = require('./controllers/application_controller');
// var tasks_controller = require('./controllers/tasks_controller');
// var people_controller = require('./controllers/people_controller');
var users_controller = require('./controllers/users_controller');

var app = express();

//allow sessions
app.use(session({ secret: 'app', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true}));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//set up handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//connects to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'projects_db',
});

//tests connection to MySQL
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    };
    console.log('connected as id ' + connection.threadId);
})

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', application_controller);
app.use('/users/:?', users_controller);
//app.use('/people', people_controller);
//app.use('/people', tasks_controller);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});

var PORT = 3000;

app.listen(PORT, function() {
    console.log("Listening on PORT " + PORT);
});

module.exports = app;
