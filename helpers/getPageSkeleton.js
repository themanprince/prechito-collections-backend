const connectDB = require(__dirname + "/connectDB");
const calcStartAndEnd = require(__dirname + "/calcStartAndEnd");
const {PG_LENGTH} = require(__dirname + "/../config/constants-config.js");

async function getPageSkeleton(pg, lengthQuery, idQuery) {
		//since most my getPage... functions are similar
		
		//lengthQuery is just the specific query to acquire the length of the records you wish to obtain a page from
		//it will be used to calculate the offset and limit of records obtained by running your
		//idQuery, which obtains the actual records themselves
		//it was named idQuery because it was originally used in Product.getPageSkeletonImpro, where it retrieved product_ids
		const conn = await connectDB();
		
		let result = await conn.query(lengthQuery);
		const length = parseInt(result.rows[0]["count"]);
		
		const [pgStart, ] = calcStartAndEnd(length, pg, PG_LENGTH);
		
		if((pgStart !=0) && (!pgStart))
			throw new RangeError("Likely Unexisting page or Unexisting category(for /product related kini)");
		
		//idQuery is each getPage implementation of a SQL statement to get a page of...
		//note the '+=' below in initialization of idQuery
		idQuery += `
			OFFSET ${pgStart} LIMIT ${PG_LENGTH}
		`;
		
		result = await conn.query(idQuery);
		
		return result.rows;
}

module.exports = getPageSkeleton;