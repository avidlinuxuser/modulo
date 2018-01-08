const express = require( 'express' );
const ModLoader = require( './modloader/modloader' );
const app = express();
const Logger = require( './log/logbuddy' );

Logger.environment( 'debug' );

var mod_loader =  new ModLoader( app );

mod_loader.scan().then( (loader) => {
	loader.initializeModules();
	return 0;
}).then( () => {
	app.listen( 3000, () => {
		Logger.log( 'Started app' );
	});
}).catch( (err) => {
	Logger.error( err );
});
