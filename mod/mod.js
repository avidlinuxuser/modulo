const express = require( 'express' );
const Logger = require( '../log/logbuddy' );
const Promise = require( 'bluebird' );

/* Private API and Helper Functions */
function _ModuleURI( mod, uri ) {
	return '/' + mod.root + '/' + uri;
}

function _ModulePATH( mod, uri ) {
	return './' + mod.root + '/' + uri;
}

function _AttachRoutes( mod, app, routes ) {
	for( var i = 0; i < routes.length; ++i ) {
		var uri = _ModuleURI( mod, routes[i].uri );
		Logger.log( `Adding dynamic route ${uri}` );	
		app.use( uri, routes[i].action );
	}	
}

function _AttachResources( mod, app, resources ) {
	for( var i = 0; i < resources.length; ++i ) {
		var uri = _ModuleURI( mod, resources[i].uri );
		var resourcePath = _ModulePATH( mod, resources[i].resource );
		Logger.log( `Adding static resource ${uri}` );	
		app.use( uri, express.static( resourcePath ) );
	}
}

function _AppendViewDirectory( mod, app, viewDirectory ) {
	if( viewDirectory ) {
		var currentViews = app.views;
		if( !currentViews ){
			currentViews = [];
		} else if( typeof currentViews === 'string' ) {
			currentViews = [ currentViews ];
		}

		currentViews.push( _ModulePATH( mod, viewDirectory ) );
		app.set('views', currentViews);
	}
}

function _ModuleAttach( callback ) {
	try {
		_AttachRoutes( this, this.app, this.routes );
		_AttachResources( this, this.app, this.resources );
		_AppendViewDirectory( this, this.app, this.view_directory );
		callback( null, null );
	} catch( e ) {
		callback( e, null );
	}
}

/* Public API */
function Module( app ) {
	this.app = app;
	this.routes = [];
	this.resources = [];
	this.root = '/';
}

Module.prototype.attach = Promise.promisify( _ModuleAttach );

Module.prototype.addRoute = function( uri, action ) {
	this.routes.push( { uri: uri, action: action } );
}

Module.prototype.addResource = function( uri, res ) {
	this.resources.push( { uri: uri, resource: res } );
} 

Module.prototype.setViewDirectory = function( view_directory ) {
	this.view_directory = view_directory;
}

Module.prototype.setRoot = function( root ) {
	this.root = root;
}

module.exports = Module;
