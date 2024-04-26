const crypto = require("crypto");

function decrypt(encryptedString) {
	return new Promise((resolve, reject) => {
		//I expect string was encypted using cipher.update(JSON.stringify(...), 'utf-8', 'hex')
		//+= cipher.final('hex')
		const algo = process.env.ENCRYPT_ALGO, key = process.env.ENCRYPT_KEY, iv = process.env.ENCRYPT_IV;
		const decipher = crypto.createDecipheriv(algo, key, iv);
		let payload = decipher.update(encryptedString, 'hex', 'utf-8');
		payload += decipher.final('utf-8');
		
		resolve(JSON.parse(payload));
	});

}

module.exports = decrypt;