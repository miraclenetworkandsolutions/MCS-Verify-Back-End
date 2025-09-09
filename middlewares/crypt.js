const crypto = require("crypto-js");
// First we get our unique key to encrypt our object
var password = process.env['CRYPT_PASSWORD'];

// Function to find SHA1 Hash of password key
function sha1(input) {
    return crypto.createHash('sha1').update(input).digest();
}

// Function to encode the object
async function encode(string) {
    var key = password;
    var encrypted = crypto.AES.encrypt(string, key).toString();
    return encrypted;
}

// Function to decode the object
async function decode(string) {
    var key = password;
    var bytes = crypto.AES.decrypt(string, key);
    var originalText = bytes.toString(crypto.enc.Utf8);
    return originalText;
}


module.exports = { encode, decode };