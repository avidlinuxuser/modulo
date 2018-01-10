const Logger = require( './logbuddy' );

module.exports = function( app ) {

	function accessMessage( req ) {
		var ip = req.headers['x-client-ip'] || req.ip;
		ip = ip.replace( '::ffff:','' );
		var method = req.method.toUpperCase();
		var url = req.originalUrl;
		
		return `${ip} - ${method} ${url}`;
	}

	app.use((req, res, next) => {
		Logger.message( 'info', Logger.LogLevelAny, 'ACCESS', accessMessage( req ) ).then( ()=> {
			next();
		}).catch( (e) => {
			Logger.error( e );
		});
	});
}
