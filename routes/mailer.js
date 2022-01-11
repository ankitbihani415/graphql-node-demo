var express = require('express')
var router = express.Router()
var ctrl = require('./../controller/mailer')

router.get('sendgrid',ctrl.sendGridTest)
router.get('nodemailer',ctrl.nodemailerTest)

module.exports = router