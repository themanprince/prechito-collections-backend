const Order = require(__dirname + "/../models/Order");
const Product = require(__dirname + "/../models/Product");
const decrypt = require(__dirname + "/../helpers/decrypt");
const princeMutex = require("prince-mutex");
const log = require(__dirname + "/../helpers/logger.js");
const PaymentService = require(__dirname + "/../services/payment.js");
const EmailService = require(__dirname + "/../services/email.js");
const {BANK_PAY_TIMEOUT} = require(__dirname + "/../config/constants-config");

const mutex = new princeMutex(); //global scoped mutex.. yes, you can see that and so what?

const OrderController = {
	async create_order(req, res) {
		const {encryptedOrder} = req.body;
		const orderObj = await decrypt(encryptedOrder);
		
		mutex.queueCritical(async () => {
			const {products_ordered} = orderObj;
			
			for(let product of products_ordered) {
				/*Product and product are not same*/const productOrdered = await Product.findById(product.product_id);
				if(product.quantity_ordered > productOrdered.quantity_avail) {
					return /*to release mutex*/res.status(400).json({
						"type": "error",
						"msg": `Quantity specified for ${productOrdered.title} is more than available quantity`
					});
				}
			}
			
			const order = new Order(orderObj);
			const order_id = await order.save();
			
			log("ORDER MADE:: " + order);
			
			const bankDetails = await PaymentService.getBankDetails(order_id); //order_id is used as ref to track payment
			setTimeout(() => {
				//omo, this just keeps getting longer
				const paymentIsMade = await PaymentService.isPaymentMade(order_id);
				if(paymentIsMade) {
					log(`ORDER PAID:: order_id:${order_id}`);
					await order.markAsPaid();
					//todo - for all admins
					await EmailService.sendOrderMadeEmail();
				} else {
					
				}
			}, BANK_PAY_TIMEOUT);
			return res.status(200).json(bankDetails);
		});
	}
};

module.exports = OrderController;