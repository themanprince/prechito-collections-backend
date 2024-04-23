const { CourierClient } = require("@trycourier/courier");

const courier = new CourierClient({ authorizationToken: process.env.EMAIL_SERVICE_API_KEY });

class EmailService {
	static async sendOrderMadeMail(recipient) {
		await courier.send({
			message: {
				to: {
					"email": recipient
				},
				template: process.env.COURIER_ORDER_EMAIL_TMP
			}
		});
	}
}

module.exports = EmailService;