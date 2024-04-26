const connectDB = require(__dirname + "/../helpers/connectDB");
const Product = require(__dirname + "/../models/Product");
const getPageSkeleton = require(__dirname + "/../helpers/getPageSkeleton");

class Order {
	
	#personal_details;
	#products_ordered;
	
	constructor(payload) {
		this.order_id = null;
		const {personal_details, products_ordered} = payload;
		this.#personal_details = personal_details;
		this.#products_ordered = products_ordered;
	}
	
	async save() {
		const conn = await connectDB();
		const {user_fname, user_phone_no, user_address} = this.#personal_details;
		//first, the order
		let query = `
			INSERT INTO pc_product.order (user_fname, user_phone_no, user_address, is_paid_for, is_order_delivered)
			VALUES ($1,$2,$3,$4,$5)
			RETURNING order_id
		`;
		const result = await conn.query(query, [user_fname, user_phone_no, user_address, false, false]);
		this.order_id = result.rows[0]["order_id"];
		//next, the products ordered
		for(let product of this.#products_ordered) {
			const {product_id, quantity_ordered} = product;
			query = `
				INSERT INTO pc_product.purchased_product (order_id, product_id, quantity_purchased)
				VALUES ($1,$2,$3)`;
			await conn.query(query, [this.order_id, product_id, quantity_ordered]);
		}
		
		return this.order_id;
	}
	
	toString() {
		const {user_fname, user_phone_no, user_address} = this.#personal_details;
		const product_ids = "[" + this.#products_ordered.map(kini => kini.product_id).join(", ") + "]";
		const {order_id} = this;
		
		return `ORDER_ID: "${order_id}", NAME: "${user_fname}", PHONE_NO: "${user_phone_no}", ADDRESS: "${user_address}", PRODUCT_IDs: "${product_ids}"`;
	}
	
	async markAsPaid() {
		const conn = await connectDB();
		
		const query = `
			UPDATE pc_product.order
				SET is_paid_for=$1
			WHERE order_id=$2
		`;
		
		await conn.query(query, [true, this.order_id]);
	}
	
	static async undoOrder(order_id) {
		const conn = await connectDB();
		
		const getPurcasedProductsQuery = `
			SELECT product_id, quantity_purchased
			FROM pc_product.purchased_product
			WHERE order_id=$1
		`;
		
		const result = await conn.query(getPurcasedProductsQuery, [order_id]);
		
		for(let product_purchased of result.rows) {
			const product_purchased_id = product_purchased.product_id;
			const originalProduct = await Product.findById(product_purchased_id);
			originalProduct.quantity_avail += product_purchased.quantity_purchased;
			
			//next line is so as to maintain interface expected by Product.findByIdAndUpdate
			originalProduct.category_ids = originalProduct.categories.map(cat => cat["product_category_id"]);
			await Product.findByIdAndUpdate(originalProduct.product_id, originalProduct);
			
			const deleteThisPurchasedProdQuery = `
				DELETE FROM pc_product.purchased_product
				WHERE product_id=$1
			`;
			
			await conn.query(deleteThisPurchasedProdQuery, [product_purchased_id]);
		}
		
		const deleteOrderQuery = `
			DELETE FROM pc_product.order
			WHERE order_id=$1
		`;
		
		await conn.query(deleteOrderQuery, [order_id]);
	}
	
	static async findById(order_id) {
		const conn = await connectDB();
		//first getting from pc_product.order table
		let query = `SELECT * FROM pc_product.order WHERE order_id=$1`;
		let result = await conn.query(query, [order_id]);
		let orderDetails = result.rows[0];
		//getting the purchased products as well
		query = `SELECT product_id, quantity_purchased, buying_price FROM pc_product.purchased_product WHERE order_id=$1`;
		result = await conn.query(query, [order_id]);
		orderDetails.products_ordered = result.rows;
		
		return orderDetails;
	}
	
	static async findByIdAndUpdateStatus(order_id, payload) {
		//for now I wish for this to only update payment status and delivery status
		//ig so that admins can change less from an already made order
		const conn = await connectDB();
		
		//commenting out next set of lines of code cus I believe admins should can't be able to change the payment status
		//and it should only be changed by timeout which checks if payment is made some time after order is made
		/*if("is_paid_for" in payload) {
			let query = `
				UPDATE pc_product.order
				SET is_paid_for=$1
				WHERE order_id=$2
			`;
			
			await conn.query(query, [payload.is_paid_for, order_id]);
		}*/
		
		if("is_order_delivered" in payload) {
			let query = `
				UPDATE pc_product.order
				SET is_order_delivered=$1
				WHERE order_id=$2
			`;
			
			await conn.query(query, [payload.is_order_delivered, order_id]);
		}
	}
	
	static async getPage(pg, is_order_delivered/*incase you wish to filter results by this param*/) {
		const lengthQuery = `
			SELECT count(*) FROM pc_product.order
			WHERE is_paid_for=true ${(is_order_delivered != undefined) ? 'AND is_order_delivered='+is_order_delivered : ''}
		`;
		
		const idQuery = `
			SELECT * FROM pc_product.order
			WHERE is_paid_for=true ${(is_order_delivered != undefined) ? 'AND is_order_delivered='+is_order_delivered : ''}
		`;
		
		const result = await getPageSkeleton(pg, lengthQuery, idQuery);
		
		return result;
	}
}

module.exports = Order;