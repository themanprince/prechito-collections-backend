const connectDB = require(__dirname + "/../helpers/connectDB");
const getPageSkeleton = require(__dirname + "/../helpers/getPageSkeleton");

async function insert_product_to_categories(product_id, category_ids) {
	const conn = await connectDB();
	for(let category_id of category_ids) {
			const query = `
				INSERT INTO pc_product.product_to_category (product_id, product_category_id)
				VALUES ($1, $2)
			`;
			await conn.query(query, [product_id, category_id]);
	}
}


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
		this.#price = parseFloat(price);
		this.#quantity_avail = parseInt(quantity_avail);
		this.#category_ids = category_ids;
	}
	
	toJSON() {
		return {
			"product_id": this.product_id,
			"title": this.#title,
			"description": this.#description,
			"image_url": this.#image_url,
			"price": this.#price,
			"quantity_avail": this.#quantity_avail,
			"category_ids": this.#category_ids
		};
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
		this.product_id = result.rows[0]["product_id"];
		
		//inserting into product_to_category table
		await insert_product_to_categories(this.product_id, this.#category_ids);
		
		return this.toJSON();
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
			SELECT c.product_category_id, c.category_name FROM pc_product.product_category AS c
			INNER JOIN pc_product.product_to_category AS pc
				ON c.product_category_id = pc.product_category_id
			INNER JOIN pc_product.product AS p
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
		
		await insert_product_to_categories(id, category_ids);
		
	}
	
	static async updateAndReturn(id, payload) {
		//the extra computation for the extra details... your pick
		await Product.findByIdAndUpdate(id, payload);
		return await Product.findById(id);
	}
	
	static async findOneAndDelete(id) {
		const conn = await connectDB();
		const query = `
			DELETE FROM pc_product.product
			WHERE product_id=$1
		`;
		
		await conn.query(query, [id]);
	}
	
	static async getPageSkeletonImpro/*vised*/(pg, lengthQuery, idQuery) {
		
		let result = await getPageSkeleton(pg, lengthQuery, idQuery);
		
		const product_ids = result.rows.map(row => row["product_id"]);

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
		
		const products = await Product.getPageSkeletonImpro(pg, lengthQuery, idQuery);
		
		return products;
	}
	
	static async getPageByCategoryName(pg, categoryName) {
		categoryName = categoryName.toLowerCase();
		
		const lengthQuery = `
			SELECT count(*) FROM pc_product.product AS p
			INNER JOIN pc_product.product_to_category AS pc
				ON pc.product_id = p.product_id
			INNER JOIN pc_product.product_category AS c
				ON c.product_category_id = pc.product_category_id
			WHERE c.category_name='${categoryName}'
		`;
		
		const idQuery = `
			SELECT p.product_id FROM pc_product.product AS p
			INNER JOIN pc_product.product_to_category AS pc
				ON pc.product_id = p.product_id
			INNER JOIN pc_product.product_category AS c
				ON c.product_category_id = pc.product_category_id
			WHERE c.category_name='${categoryName}'
			ORDER BY p.product_id
		`;
		
		const products = await Product.getPageSkeletonImpro(pg, lengthQuery, idQuery);
		
		return products;
		
	}
}

module.exports = Product;