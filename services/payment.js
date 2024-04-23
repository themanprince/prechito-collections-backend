class PaymentService {
	static async getBankDetails(ref) {
		//this is for bank transfer payments, this is an abstraction over the API that gets the bank details
		//for now tis does nothing
		return {"acct_num": "", "acct_name": ""};
	}
	
	static async isPaymentMade(ref) {
		//yea, of course
		return true;
	}
}

module.exports = PaymentService;