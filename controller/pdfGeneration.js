const fs = require('fs');
const pdf = require('html-pdf');
const Handlebars = require("handlebars");
const request = require('request');

var html = fs.readFileSync('./views/test.html', 'utf8');
var options = { format: 'Letter' };

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(`${appRoot}/temp_pdf/${filename}`)).on('close', callback);
  });
};

// download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
//   console.log('done');
// });
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
        // fs.unlinkSync(`${appRoot}/temp_pdf/${data.image1}`);
        // fs.unlinkSync(`${appRoot}/temp_pdf/${data.image2}`);
        var source = fs.readFileSync('./views/handlebartest.handlebars', 'utf8');
        // var source = fs.readFileSync('./views/print.handlebars', 'utf8');
        const template = Handlebars.compile(source);
        data = {
            created_at:'today',
            owner_name : 'ankit',
            image1 : 'https://lh3.googleusercontent.com/-NwvTxqbH1mk/YD3XcsYQXmI/AAAAAAAACXU/kD91V1AnNYUiVm5uFBVkagz2KPqqocbBACK8BGAsYHg/s0/2021-03-01.png',
            image2 : 'https://d3gwru59h34lrx.cloudfront.net/creatives/4655/3510/tmp_2Ff0484d31_2F_241612942347429.jpeg',
            image3 : 'google.png',
            image4 : 'tmp_s3.jpeg'
        }
        image = data.image2.split('/')
        img2 = image[image["length"]-1]
        download(data.image2, img2, function(){
            data.image2 = img2
        });
        image = data.image1.split('/')
        img1 = image[image["length"]-1]
        download(data.image1, img1, function(){
            data.image1 = img1
        });
        pdf.create(template(data),{
            format:'Legal',
            orientation:'landscape',
            base:`file:///${appRoot}/temp_pdf/`
        }).toStream(function(err, stream){
            stream.pipe(fs.createWriteStream('./hanlebarfoo.pdf'));
            console.log(data)
            // fs.unlinkSync(`${appRoot}/temp_pdf/${data.image2}`);
            // fs.unlinkSync(`${appRoot}/temp_pdf/${data.image1}`);
            res.status(200).send('check file')
        });
    },
    handleBarBuffer : (req, res) => {
        var requestBuffer = require('request').defaults({ encoding: null });

        requestBuffer.get('https://d3gwru59h34lrx.cloudfront.net/creatives/4655/3510/tmp_2Ff0484d31_2F_241612942347429.jpeg', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                image = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                // console.log(data);
                data = {
                    created_at:'today',
                    owner_name : 'ankit',
                    image1 : image,
                    image2 : image,
                    image3 : image,
                    image4 : image
                }
                var source = fs.readFileSync('./views/handlebartest.handlebars', 'utf8');
                // var source = fs.readFileSync('./views/print.handlebars', 'utf8');
                const template = Handlebars.compile(source);
                pdf.create(template(data),{
                    format:'Legal',
                    orientation:'landscape',
                    base:`file:///${appRoot}/temp_pdf/`
                }).toStream(function(err, stream){
                    stream.pipe(fs.createWriteStream('./hanlebarfoobuffer.pdf'));
                    // console.log(data)
                    // fs.unlinkSync(`${appRoot}/temp_pdf/${data.image2}`);
                    // fs.unlinkSync(`${appRoot}/temp_pdf/${data.image1}`);
                    res.status(200).send('check file')
                });
            }
        });
    }
}
