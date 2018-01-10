const express = require( 'express' );
const ModLoader = require( './modloader/modloader' );
const app = express();
const Logger = require( './log/logbuddy' );

try {
	app.set('view engine', 'ejs' );

	Logger.setLogFile( 'modulo.log' );
	Logger.environment( 'production' );

	const AccessLog = require( './log/logbuddyexpress' );
	AccessLog( app );

	var mod_loader =  new ModLoader( app );

	mod_loader.scan().then( (loader) => {
		return loader.initializeModules();
	}).then( () => {
		app.listen( 3000, () => {
			Logger.log( 'Started app' );
		});
	}).catch( (err) => {
		Logger.error( err );
	});
} catch( e ) {
	Logger.err( JSON.stringify( e ) );
}
