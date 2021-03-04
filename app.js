var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pdfRouter = require('./routes/pdfgen');
var { graphqlHTTP } = require('express-graphql');

var {helloSchema,helloRoot} = require('./graphql/hello_world')
var {courseSchema,courseRoute} = require('./graphql/course')

var app = express();
global.appRoot = path.resolve(__dirname);

app.use('/course-graphql', graphqlHTTP({
  schema: courseSchema,
  rootValue: courseRoute,
  graphiql: true,
}));
app.use('/hello-graphql', graphqlHTTP({
  schema: helloSchema,
  rootValue: helloRoot,
  graphiql: true,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pdf', pdfRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
