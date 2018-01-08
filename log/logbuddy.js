const Promise = require( 'bluebird' );
const fs = Promise.promisifyAll( require( 'fs' ) );
const stackTrace = require( 'stack-trace' );
const moment = require( 'moment' );

function ConsoleLog( type, message, callback ) {
	try {
		console[type]( message );
		callback( null, null );
	} catch( e ) {
		callback( e, null );
	}
}

function DoNothing( callback ){
	callback( null, null );
}

function PrepareMessage( type, message ) {
	var time = moment().format( 'DD/MMM/YYYY h:mm:ss a' );
	var currentTrace = stackTrace.get();
	return type + ' - ' + time + ' - ' + message + ' from ' + currentTrace[2].getFileName() + ' in function ' + currentTrace[2].getFunctionName(); 	
}

const ConsoleLogAsync = Promise.promisify( ConsoleLog );
const DoNothingAsync = Promise.promisify( DoNothing );


function Logger() {
	this.logFile = null;
	this.environment( 'production' );
}

Logger.prototype.setLogFile = function( path ) {
	this.logFile = path;
}

Logger.prototype.getLogLevel = function(){
	return this.log_level;
}

Logger.prototype.environment = function( mode ) {
	switch( mode.toLowerCase() ) {
		case 'production':
			this.log_level = Logger.LogLevelFatal;
			break;
		case 'development':
			this.log_level = Logger.LogLevelWarn;
			break;
		case 'debug':
			this.log_level = Logger.LogLevelInfo;
			break;
	}
}

Logger.prototype.log = function( message ) {
	message = PrepareMessage( 'DEBUG', message );
	if( this.getLogLevel() <= Logger.LogLevelInfo ) {
		if( this.logFile ) {
			return fs.writeFile( this.logFile, message );
		} else {
			return ConsoleLogAsync( 'log', message );
		}
	} else {
		return DoNothingAsync();
	}
}

Logger.prototype.info = function( message ) {
	message = PrepareMessage( 'WARNING', message );
	if( this.getLogLevel() <= Logger.LogLevelWarn ) {
		if( this.logFile ) {
			return fs.writeFile( this.logFile, message );
		} else {
			return ConsoleLogAsync( 'info', message );
		}
	} else {
		return DoNothingAsync();
	}
}

Logger.prototype.error = function( message ) {
	message = PrepareMessage( 'ERROR', message );
	if( this.getLogLevel() <= Logger.LogLevelFatal ) {
		if( this.logFile ) {
			return fs.writeFile( this.logFile, message );
		} else {
			return ConsoleLogAsync( 'info', message );
		}
	} else {
		return DoNothingAsync();
	}
}

Logger.LogLevelInfo = 0;
Logger.LogLevelWarn = 1;
Logger.LogLevelFatal = 2;
Logger.LogLevelNone = 3;

module.exports = new Logger();
