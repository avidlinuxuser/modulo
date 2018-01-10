const Promise = require('bluebird');
const fs = Promise.promisifyAll( require('fs') );
const Logger = require( '../log/logbuddy' );
const BASE_MODULE_LOCATION = '../mod/mod';

//Using no js file name as require will assume index.js when no file specified
const PACKAGE_INDEX = ''; 

Canonicalize = ( file ) => {
	if( file ) {
		return '../' + file;
	} else {
		return '../';
	}
}

ModuleImplementor = ( file ) => {
	if( file ) {
		return '/' + file.replace( '.js', '' );
	} else {
		return PACKAGE_INDEX;
	}
}

ModulePath = ( directory, mod_impl ) => {
	if( mod_impl ) {
		return Canonicalize( directory ) + ModuleImplementor( mod_impl );	
	} else {
		return BASE_MODULE_LOCATION;
	}
}

function CreateModule( app, directory, settings ) {
	Logger.log( `Loading module ${directory}. Description: ${settings.description}` );	
	const Module = require( ModulePath( directory, settings.impl ) );	
	var module = new Module( app );
	module.setRoot( directory );

	if( settings.routers ) {
		for( var i = 0; i < settings.routers.length; ++i ) {
			const router = require( ModulePath( directory, settings.routers[i].path ) );
			module.addRoute( settings.routers[i].uri, router );
		}	
	}

	if( settings.resources ) {
		for( var i = 0; i < settings.resources.length; ++i ) {
			module.addResource( settings.resources[i].uri, settings.resources[i].path );
		}
	}

	if( settings.view_directory ) {
		module.setViewDirectory( settings.view_directory );
	}
	
	module.description = settings.description;

	return module;
}

function ModuleLoader( app ){
	this.app = app;
}

ModuleLoader.prototype.scan = function(){
	const self = this;

	return fs.readdirAsync( './' ).then( (files) => {
		var candidates = [];
		Logger.log( 'Building candidates' );
		for( var i = 0;i < files.length; ++i ) {
			if( fs.statSync( files[i] ).isDirectory() ) {
				if( fs.existsSync( files[i] + '/mod.json' ) ) {
					candidates.push( files[i] );
				}
			}
		}
		return Promise.map( candidates, ( directory ) => {
			return self.load( directory );
		});
	}).then( (modules) => {
		Logger.log( JSON.stringify( modules )  );	
		self.modules = modules;
		return self;
	});
}

ModuleLoader.prototype.initializeModules = function(){
	return Promise.map( this.modules, ( module ) => {
		if( module ) {
			return module.attach();		
		}
	});
}

ModuleLoader.prototype.load = function( directory ){
	var app = this.app;
	Logger.log( 'Doin this load' );
	return fs.readFileAsync( directory + '/mod.json' )
	.then( JSON.parse )
	.then( ( settings ) => {
		if( settings.active ) {
			return CreateModule( app, directory, settings );
		} else {
			return null;
		}
	}); 
}

module.exports = ModuleLoader;
