const connectDB = require(__dirname + "/../helpers/connectDB");
const Product = require(__dirname + "/../models/Product");

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
				INSERT INTO pc_product.purchased_product (order_id, product_id, quantity_ordered)
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
	
	async undoOrder(order_id) {
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
}

module.exports = Order;