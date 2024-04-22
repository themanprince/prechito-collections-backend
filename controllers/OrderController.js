const Order = require(__dirname + "/../models/Order");
const Product = require(__dirname + "/../models/Product");
const decrypt = require(__dirname + "/../helpers/decrypt");
const princeMutex = require("prince-mutex");

const mutex = new princeMutex(); //global scoped mutex.. yes, you can see that and so what?

const OrderController = {
	async create_order(req, res) {
		const {encryptedOrder} = req.body;
		const order = await decrypt(encryptedOrder);
		
		mutex.queueCritical(async () => {
			const {products_ordered} = order;
			let promiseArr = [];
			for(let product of products_ordered) {
				/*Product and product are not same*/const productOrdered = await Product.findById(product.product_id);
				if(product.quantity_ordered > productOrdered.quantity_avail) {
					return /*to release mutex*/res.status(400).json({
						"type": "error",
						"msg": `Quantity specified for ${productOrdered.title} is more than available quantity`
					});
				}
			}
			//TODO - implement this order-creation line as model method, Order.createOrder
		});
	}
};

module.exports = OrderController;