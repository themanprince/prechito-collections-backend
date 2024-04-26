const Order = require(__dirname + "/../models/Order");
const Product = require(__dirname + "/../models/Product");
const Admin = require(__dirname + "/../models/Admin");
const decrypt = require(__dirname + "/../helpers/decrypt");
const princeMutex = require("prince-mutex");
const log = require(__dirname + "/../helpers/logger.js");
const PaymentService = require(__dirname + "/../services/payment.js");
const EmailService = require(__dirname + "/../services/email.js");
const {BANK_PAY_TIMEOUT} = require(__dirname + "/../config/constants-config");

const mutex = new princeMutex(); //had to make sure it was globally scoped

const OrderController = {
	async create_order(req, res) {
		const {encryptedOrder} = req.body;
		//make sure req.body has a field called encryptedOrder
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
	
			res.status(200).json(bankDetails);
			
			async function checkIfPaymentMadeAfterTimeout() {
				//this will be called after following timeout
				const paymentIsMade = await PaymentService.isPaymentMade(order_id);
				if(paymentIsMade) {
					log(`ORDER PAID:: ORDER_ID:${order_id}`);
					await order.markAsPaid();
					const admins = await Admin.getAllEmailsAndNames();
					
					for(let admin of admins) {
						const admin_name = admin.username;
						const {user_fname, user_address} = orderObj.personal_details;
						await EmailService.sendOrderMail(admin.email, {admin_name, "user_name": user_fname, user_address});
					}
					//todo - whenever... send user a receipt... cant use already-used res Object
				} else {
					await Order.undoOrder(order_id);
					log(`ORDER DELETED:: ORDER_ID:${order_id}`);
				}
			}
			
			setTimeout(checkIfPaymentMadeAfterTimeout, BANK_PAY_TIMEOUT);

		});
	},
	
	async get_order(req, res) {
		try {
            const order = await Order.findById(req.params.userId);
            if (!order)
                res.status(404).json({
                    "type": "error",
                    "message": "Order doesn't exists"
                })
            else
                res.status(200).json({
                    "type": "success",
                    "data": order
                })
            
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                "err": err.message
            })
        }
	},
	
	async update_order(req, res) {
		try {
			const {id} = req.params;
			await Order.findByIdAndUpdateStatus(id, req.query); //shikina... two lines.. power of good design
			res.status(200).json({
				type: "success",
				"message": "done"
			});			
		} catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                "err": err.message
            })
		}
	},
	
	async get_orders(req, res) {
		const pg = req.params.pg || 0;
		const is_order_delivered = req.params.is_order_delivered;
		
		try {
			const result = await Order.getPage(pg, is_order_delivered);
			res.status(200).json({
				"type": "success",
				"data": result
			});
		} catch(err) {
			res.status(500).json({
				"type": error,
				"message": err.message
			});
		}
	}
};

module.exports = OrderController;