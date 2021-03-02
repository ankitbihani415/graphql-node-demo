var fs = require('fs');
var pdf = require('html-pdf');


var html = fs.readFileSync('./views/test.html', 'utf8');
var options = { format: 'Letter' };
module.exports = {
    pdfCreate : (req,res) => {
        pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
        if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
            
        })
        res.status(200).send('check file')
    },
    pdfStream : (req,res) => {
        pdf.create(html).toStream(function(err, stream){
            stream.pipe(fs.createWriteStream('./foo.pdf'));
        });
        res.status(200).send('check file')
    }
}
