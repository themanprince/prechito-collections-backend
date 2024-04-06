//this module takes a string that ossibly contains aa regex and escapes all the regex in it.. innit?
//credit goes to Marijn Haverbeke

function escape(text) {
	return text.replace(/[\\[.+*?(){|^$]/g, "\\$&");
}

module.exports = escape;
