const express = require( 'express' );
const ModLoader = require( './modloader/modloader' );
const app = express();
const Logger = require( './log/logbuddy' );

var mod_loader =  new ModLoader( app );

mod_loader.scan().then( (loader) => {
	loader.initializeModules();
	return 0;
}).then( () => {
	app.listen( 3000, () => {
		console.log( 'Started app' );
	});
}).catch( (err) => {
	Logger.error( err );
});
