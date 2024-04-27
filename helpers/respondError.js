module.exports = function respondError(res, err) {
	res.status(500).json({
		"type": "error",
		"message": err.toString()
	});
}