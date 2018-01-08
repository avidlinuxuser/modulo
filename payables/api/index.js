module.exports = {
	getVendors(){
		return [{ _id: 123, name: 'Test Name' }];
	}, 
	getInvoices(){
		return [{ _id: 12345, invoice: 'CLR123', vendor: 123, amount: 90.27}];
	}
};
