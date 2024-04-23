const {Pool} = require("pg");

let pool = new Pool({
	"port": 5432,
	"host": "localhost",
	"password": "",
	"database": "prechitocollections",
	"user": "themanprince"
});


(async () => {
	let query = `DROP TABLE IF EXISTS test`;

	await pool.query(query);
	
	query = `CREATE TABLE test(num BOOLEAN)`;

	await pool.query(query);
	
	const num = true;
	query = `INSERT INTO test (num) VALUES ($1)`;
	
	await pool.query(query, [num]);
	query = `SELECT * FROM test`;
	
	console.log(await pool.query(query));
	
	query = `DROP TABLE test`;

	await pool.query(query);
	
})();