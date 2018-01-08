const express = require( 'express' );
const ModLoader = require( './modloader/modloader' );
const app = express();
const Logger = require( './log/logbuddy' );

app.set('view engine', 'ejs' );

Logger.setLogFile( 'modulo.log' );
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
