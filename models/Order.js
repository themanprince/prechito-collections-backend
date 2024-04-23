const connectDB = require(__dirname + "/../helpers/connectDB");

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
				INSERT INTO pc_product.purchased_products (order_id, product_id, quantity_ordered)
				VALUES ($1,$2,$3)`;
			await conn.query(query, [order_id, product_id, quantity_ordered]);
		}
		
		return this.order_id;
	}
	
	toString() {
		const {user_fname, user_phone_no, user_address} = this.#personal_details;
		const product_ids = this.#products_ordered.map(kini => kini.product_id).join(", ");
		const {order_id} = this;
		
		return `ORDER_ID: ${order_id},NAME: ${user_fname}, PHONE_NO: ${user_phone_no}, ADDRESS: ${user_address}, PRODUCT_IDs: ${product_ids}`;
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
}

module.exports = Order;