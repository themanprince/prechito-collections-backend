const connectDB = require(__dirname + "/../helpers/connectDB");
const calcStartAndEnd = require(__dirname + "/../helpers/calcStartAndEnd");
const {PG_LENGTH} = require(__dirname + "/../config/constants-config.js");

class Product {
	
	#title;
	#description;
	#image_url;
	#price;
	#quantity_avail;
	#category_ids; //array
	
	constructor(payload) {
		this.product_id = null;
		
		const {title, description, image_url, price, quantity_avail, category_ids} = payload;
		this.#title = title;
		this.#description = description;
		this.#image_url = image_url;
		this.#price = price;
		this.#quantity_avail = quantity_avail;
		this.#category_ids = category_ids;
	}
	
	static async insert_product_to_categories(product_id, category_ids) {
		const conn = await connectDB();
		for(let category_id of category_ids) {
				const query = `
					INSERT INTO pc_product.product_to_category (product_id, product_category_id)
					VALUES ($1, $2)
				`;
				await conn.query(query, [product_id, category_id]);
		}
	}
	
	async save() {
		const conn = await connectDB();
		
		//saving to normal table
		let query = `
			INSERT INTO pc_product.product (title, description, image_url, price, quantity_avail)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING product_id;
		`;
		
		const result = await conn.query(query, [this.#title, this.#description, this.#image_url, this.#price, this.#quantity_avail]);
		this.product_id = result.row[0]["product_id"];
		
		//inserting into product_to_category table
		await insert_product_to_categories(this.product_id, this.#category_ids);
	}
	
	static async findById(id) {
		let product = {};
		const conn = await connectDB();
		//first getting product details only
		let query = `
			SELECT * FROM pc_product.product
			WHERE product_id=$1
		`;
		let result = await conn.query(query, [id]);
		product = result.rows[0];
		
		//next getting the category names
		query = `
			SELECT * FROM pc_product.product_category AS c
			INNER JOIN product_to_category AS pc
				ON c.category_id = pc.category_id
			INNER JOIN product AS p
				ON pc.product_id = p.product_id
			WHERE p.product_id = ${id}
		`;
		
		result = await conn.query(query);
		product.categories = result.rows; //note the nature of the returned interface
		
		return product;
	}
		
	static async findByIdAndUpdate(id, payload) {
		const conn = await connectDB();
		
		const productAndCat/*egories*/ = await Product.findById(id);
		const {title, description, price, image_url, quantity_avail, category_ids} = payload;
		
		let updateQuery = `
			UPDATE pc_product.product
			SET title=$1,
				description=$2,
				price=$3,
				image_url=$4,
				quantity_avail=$5
			WHERE product_id=$6
		`;
		await conn.query(updateQuery, [title, description, price, image_url, quantity_avail, id]);
		//next to redo its categories
		
		let deleteQuery = `
			DELETE FROM pc_product.product_to_category
			WHERE product_id=$1
		`;
		await conn.query(deleteQuery, [id]);
		
		await Product.insert_product_to_categories(id, category_ids);
	}
	
	static async findOneAndDelete(id) {
		const conn = await connectDB();
		const query = `
			DELETE FROM pc_product.product
			WHERE product_id=$1
			CASCADE
		`;
		
		await conn.query(query, [id]);
	}
	
	static async getPageSkeleton(pg, lengthQuery, idQuery) {
		//since most my getPage... functions are similar
		
		const conn = await connectDB();
		
		let result = await conn.query(lengthQuery);
		const length = parseInt(result.rows[0]["count"]);
		
		const [pgStart, ] = calcStartAndEnd(length, pg, PG_LENGTH);
		
		//idQuery is each getPage implementation of a SQL statement to get a page of...
		//note the '+=' below in initialization of idQuery
		const idQuery += `
			OFFSET ${pgStart} LIMIT ${PG_LENGTH}
		`;
		
		result = await conn.query(idQuery);
		
		product_ids = result.rows.filter(row => row["product_id"]);
		let products = [];
		
		for(let id of product_ids)
			products.push(await Product.findById(id));
		
		return products;
	}
	
	static async getPage(pg) {
		//a page of products sorted temporally/chronologically
		//NO FILTERS
		
		const lengthQuery = `
			SELECT count(*) FROM pc_product.product
		`;
		
		//this next line is 'ORDER BY product_id' because product_id has better chronological properties
		//compared to timestamp...as two rows could actually have same timestamp
		const idQuery = `
			SELECT product_id FROM pc_product.product
			ORDER BY product_id
		`;
		
		const products = await Product.getPageSkeleton(pg, lengthQuery, idQuery);
		
		return products;
	}
	
	static async getPageByCategoryName(pg, categoryName) {
		const lengthQuery = `
			SELECT count(*) FROM pc_product.product AS p
			INNER JOIN pc_product.product_to_category AS pc
				ON pc.product_id = p.product_id
			INNER JOIN pc_product.product_category AS c
				ON c.product_category_id = pc.product_category_id
			WHERE c.name=${categoryName.toLowerCase()}
		`;
		
		const idQuery = `
			SELECT p.product_id FROM pc_product.product AS p
			INNER JOIN pc_product.product_to_category AS pc
				ON pc.product_id = p.product_id
			INNER JOIN pc_product.product_category AS c
				ON c.product_category_id = pc.product_category_id
			WHERE c.name=${categoryName.toLowerCase()}
			ORDER BY p.product_id
		`;
		
		const products = await Product.getPageSkeleton(pg, lengthQuery, idQuery);
		
		return products;
		
	}
}

module.exports = Product;