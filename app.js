var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv').config();

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

app.get('/send-email',function(req,res){
	// using Twilio SendGrid's v3 Node.js Library
	// https://github.com/sendgrid/sendgrid-nodejs
	const sgMail = require('@sendgrid/mail')
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)
	const msg = {
		to: 'hkanwar@dgera.com', // Change to your recipient
		from: 'ankitbihani415@gmail.com', // Change to your verified sender
		subject: 'Sending with SendGrid is Fun',
		text: 'and easy to do anywhere, even with Node.js',
		html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	}
	sgMail
    .send(msg)
    .then(() => {
		console.log('Email sent')
    })
    .catch((error) => {
		console.error('error => ',error.response.body)
    })
  
	res.send({msg:'check mail'})
})

app.get('/mailer',function(req,res){
	const nodemailer = require('nodemailer');
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_SERVER,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS
		},
		secureConnection: false,
		secure: false,
		tls: { ciphers: 'SSLv3' },
		requireTLS: true
	});

	// Send an email to support
	var emailBody = {
		from: process.env.SMTP_SENDER,
		to: process.env.SUPPORT_EMAIL,
		subject: 'Email test from nodemailer',
		text: 'this is test email from node mailer',
		html: '<p>node mail test successs.</p>'
	};
	transporter.sendMail(emailBody, function(err, info) {
		if (err) { console.log('Error sending mail: ' + err) }
	});
	res.send({msg:'check mail'})
})

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
