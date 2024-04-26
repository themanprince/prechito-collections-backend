const { CourierClient } = require("@trycourier/courier");

//get API key from process.env
const courier = new CourierClient({ authorizationToken: "pk_prod_5N3BEQDDYZMAF6QFPKSKH1VX8GQ8" });
courier.send({
	message: {
		to: {
			email: "themanprvnce@gmail.com"
		},
		template: "46F43KZSMKM79BJ1MKA6C7CBQTDV"
	}
}).then(({requestId}) => {
	console.log("requestId is", requestId);
}).catch(console.error);