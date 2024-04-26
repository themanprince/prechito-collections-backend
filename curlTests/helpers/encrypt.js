const crypto = require("crypto");

//duhh
const stringToEncrypt = process.argv[2];
const key="what-if-I-told-you-that-I-love-u", iv="do-you-feel-same", algo="aes-256-cbc";

const cipher = crypto.createCipheriv(algo, key, iv);

let encryptedOutput = cipher.update(stringToEncrypt, 'utf-8', 'hex');
encryptedOutput += cipher.final('hex');

console.log(encryptedOutput); //output to stdout