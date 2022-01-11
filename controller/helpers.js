var axios = require('axios')
var base64Img = require('base64-img');

/**
 * 
 * var requestBuffer = require('request').defaults({ encoding: null });

        requestBuffer.get(imageUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                image = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
           
 */
const getBufferData = async (imageUrl) => {
    var image;
    return axios.get(imageUrl, {responseType: 'arraybuffer'})
        .then(json => {
            image = "data:" + json.headers["content-type"] + ";base64," + Buffer.from(json.data).toString('base64');
            return image
        }).catch((err)=>{
            debugger
        })
    // let image = await axios.get(imageUrl, {responseType: 'arraybuffer'});
    // let raw = Buffer.from(image.data).toString('base64');
    // debugger
    // return "data:" + image.headers["content-type"] + ";base64,"+raw;
    // base64Img.requestBase64(imageUrl, function(err, res, body) {
    //     image =  body
    //     return image
    // });
}


module.exports = getBufferData