const express = require( 'express' );
const router = express.Router();
const PayablesAPI = require( '../api' );

router.get( '/invoices', ( req, res ) => {
	res.json( PayablesAPI.getInvoices() );
}); 

router.get( '/vendors', ( req, res ) => {
	res.json( PayablesAPI.getVendors() );
});

router.get( '/vendor/:id', ( req, res ) => {
	res.render( 'payables/vendor-page', { vendor: PayablesAPI.getVendors()[0] } );	
});

module.exports = router;
