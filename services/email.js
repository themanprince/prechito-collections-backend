const { CourierClient } = require("@trycourier/courier");

const courier = new CourierClient({ authorizationToken: process.env.EMAIL_SERVICE_API_KEY });

class EmailService {
	static async sendOrderMail(recipient, payload) {
		const {admin_name, user_name, user_address} = payload;
		await courier.send({
			message: {
				to: {
					"email": recipient
				},
				template: process.env.COURIER_ORDER_EMAIL_TMP,
				data: {
					admin_name, user_name, user_address
				}
			}
		});
	}
}

module.exports = EmailService;