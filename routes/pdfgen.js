var express = require('express');
var router = express.Router();
var cntrl = require('./../controller/pdfGeneration')

/* GET users listing. */
router.get('/pdf-create', cntrl.pdfCreate);
router.get('/pdf-stream', cntrl.pdfStream);
router.get('/pdf-handlebar', cntrl.handleBar);
router.get('/pdf-buffer',cntrl.handleBarBuffer);


module.exports = router;
