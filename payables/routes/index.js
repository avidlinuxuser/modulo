const express = require( 'express' );
const router = express.Router();
const PayablesAPI = require( '../api' );

router.get( '/invoices', ( req, res ) => {
	res.json( PayablesAPI.getInvoices() );
}); 

router.get( '/vendors', ( req, res ) => {
	res.json( PayablesAPI.getVendors() );
});

module.exports = router;
