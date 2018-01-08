const express = require( 'express' );
const Logger = require( '../log/logbuddy' );

function moduleURI( mod, uri ) {
	return '/' + mod.root + '/' + uri;
}

function modulePATH( mod, uri ) {
	return './' + mod.root + '/' + uri;
}

function Module( app ) {
	this.app = app;
	this.routes = [];
	this.resources = [];
	this.root = '/';
}

Module.prototype.attach = function() {
	Logger.log( 'Attaching module routes' );	
	for( var i = 0; i < this.routes.length; ++i ) {
		var uri = moduleURI( this, this.routes[i].uri );
		Logger.log( `Adding dynamic route ${uri}` );	
		this.app.use( uri, this.routes[i].action );
	}	

	for( var i = 0; i < this.resources.length; ++i ) {
		var uri = moduleURI( this, this.resources[i].uri );
		var resourcePath = modulePATH( this, this.resources[i].resource );
		Logger.log( `Adding static resource ${uri}` );	
		this.app.use( uri, express.static( resourcePath ) );
	}
}

Module.prototype.addRoute = function( uri, action ) {
	this.routes.push( { uri: uri, action: action } );
}

Module.prototype.addResource = function( uri, res ) {
	this.resources.push( { uri: uri, resource: res } );
} 

Module.prototype.setRoot = function( root ) {
	this.root = root;
}

module.exports = Module;
