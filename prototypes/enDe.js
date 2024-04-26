//enDe is short for encryption/Decryption the same way MoDem is short for
//modulator/Demodulator

const crypto = require("crypto");

//no gpt to ask now, so I finna try to use text instead of buffers for ky and iv
const algo = "aes-256-cbc";
const key = "what if I told you that I love u";//must be 32bytes exac //will be stored in process.env
const iv = "do you feel same"; //must be 16bytes exac

const cipher = crypto.createCipheriv(algo, key, iv);

const testString = JSON.stringify({'string': 'Hello world'});

console.log(testString);

let encryptedData = cipher.update(testString, "utf-8", "hex");
encryptedData += cipher.final('hex');

console.log("Encryted data: ", encryptedData);

//deccryting
const decipher = crypto.createDecipheriv(algo, key, iv);
let payload = decipher.update(encryptedData, 'hex', 'utf-8');
payload += decipher.final('utf-8');

console.log("Decrypted data:", payload);