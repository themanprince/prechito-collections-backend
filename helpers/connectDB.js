const {Pool} = require("pg");

let pool;

module.exports = async function() { //so pool won't be created unless someone need it
	if(!!pool)
		return pool;
	
	pool = new Pool({
		"port": process.env.DB_PORT,
		"host": process.env.DB_HOST,
		"password": process.env.DB_PASSWORD,
		"database": process.env.DB_NAME,
		"user": process.env.DB_USER
	});
	
	await pool.query("SELECT 'Connected To DB successfully'"); //should throw error if serrver aint on
	
	return pool;
};