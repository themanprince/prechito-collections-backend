const fs = require("fs");

const logStream = fs.createWriteStream(__dirname + "/../logs/order-logs.txt");

function log(kini) {
	const date = new Date();
	const string = `${kini} \n-- ${date}\n\n\n`;
	logStream.write(string);
}


module.exports = log;