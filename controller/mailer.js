require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = {
    nodemailerTest : (req,res) => {
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
            from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_USER}>`,
            to: process.env.SUPPORT_EMAIL,
            subject: 'Email test from nodemailer',
            text: 'this is test email from node mailer',
            // html: '<p>node mail test successs.</p>'
        };
        transporter.sendMail(emailBody, function(err, info) {
            if (err) {
                console.log('Error sending mail: ' + err) 
                res.send({msg:'Error sending mail: ' + err})
            }
            // debugger
            res.send({msg:'check mail: ', 'info': info})
        });
    },
    sendGridTest : (req,res) => {
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
    }
}