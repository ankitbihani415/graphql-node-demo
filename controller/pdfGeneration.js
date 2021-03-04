var fs = require('fs');
var pdf = require('html-pdf');
const Handlebars = require("handlebars");

var html = fs.readFileSync('./views/test.html', 'utf8');
var options = { format: 'Letter' };
module.exports = {
    pdfCreate : (req,res) => {
        pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
        if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
            res.status(200).send('check file')
        })
    },
    pdfStream : (req,res) => {
        pdf.create(html).toStream(function(err, stream){
            stream.pipe(fs.createWriteStream('./foo.pdf'));
            res.status(200).send('check file')
        });
    },
    handleBar : (req,res) => {
        // var source = fs.readFileSync('./views/handlebartest.handlebars', 'utf8');
        var source = fs.readFileSync('./views/print.handlebars', 'utf8');
        const template = Handlebars.compile(source);
        data = {
            created_at:'today',
            owner_name : 'ankit',
            image1 : 'https://lh3.googleusercontent.com/-NwvTxqbH1mk/YD3XcsYQXmI/AAAAAAAACXU/kD91V1AnNYUiVm5uFBVkagz2KPqqocbBACK8BGAsYHg/s0/2021-03-01.png',
            image2 : 'https://d3gwru59h34lrx.cloudfront.net/creatives/4655/3510/tmp_2Ff0484d31_2F_241612942347429.jpeg'
        }
        pdf.create(template(data),{
            format:'Legal',
            orientation:'landscape',
            base:'127.0.1:8000'
        }).toStream(function(err, stream){
            stream.pipe(fs.createWriteStream('./hanlebarfoo.pdf'));
            res.status(200).send('check file')
        });
    }
}
