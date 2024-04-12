const connectDB = require(__dirname + "/../helpers/connectDB");

class Category {
	static async save(categories) {
		if(Array.isArray(categories)) {
			const category_ids = [];
			for(let category of categories) {
				const id = await Category.save(category);
				category_ids.push(id);
			}
			return category_ids;
		} else {
			let categoryLC = categories/*ish*/.toLowerCase();
			const pool = await connectDB();
			const cat_exists_query = `
				SELECT
					CASE
						WHEN EXISTS (SELECT name FROM pc_product.product_category WHERE name='${categoryLC}')
							THEN 1
							ELSE 0
					END AS exists
			`;
			const result = (await pool.query(cat_exists_query)).rows[0]["exists"];

			const exists = ( result == "1") ? true : false;
			if(exists)
				throw new Error("category already exists with this name");
			else {
				const insert_query = `INSERT INTO pc_product.product_category (name) VALUES ($1) RETURNING product_category_id`;
				const result = await pool.query(insert_query, [categoryLC]);
				return result.rows[0]["product_category_id"];
			}
		}
	}
}

module.exports = Category;