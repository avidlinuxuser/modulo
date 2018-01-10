const Promise = require( 'bluebird' );
const fs = Promise.promisifyAll( require( 'fs' ) );
const stackTrace = require( 'stack-trace' );
const moment = require( 'moment' );
const os = require( 'os' );

/* Private API Functions */

function _Line( message ) {
	return message + os.EOL;
}

function _ConsoleLog( type, message, callback ) {
	try {
		console[type]( message );
		callback( null, null );
	} catch( e ) {
		callback( e, null );
	}
}

function _DoNothing( callback ){
	callback( null, null );
}

function _PrepareMessage( type, showStack, message ) {
	var time = moment().format( 'DD/MMM/YYYY h:mm:ss a' );
	var currentTrace = stackTrace.get();
	var message = type + ' - ' + time + ' - ' + message;
	if( showStack ) {
		message += ' from ' + currentTrace[2].getFileName() + ' in function ' + currentTrace[2].getFunctionName(); 	
	}
	return message;
}

const _ConsoleLogAsync = Promise.promisify( _ConsoleLog );
const _DoNothingAsync = Promise.promisify( _DoNothing );

/* Public API */
function Logger() {
	this.logFile = null;
	this.environment( 'production' );
	for( var x in Logger ) {
		this[x] = Logger[x];
	}
}

Logger.LogLevelAny = -1;
Logger.LogLevelInfo = 0;
Logger.LogLevelWarn = 1;
Logger.LogLevelFatal = 2;
Logger.LogLevelNone = 3;

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
	return this.message( 'log', Logger.LogLevelInfo, 'DEBUG', message );
}

Logger.prototype.info = function( message ) {
	return this.message( 'info', Logger.LogLevelWarn, 'WARNING', message );
}

Logger.prototype.error = function( message ) {
	return this.message( 'error', Logger.LogLevelFatal, 'ERROR', message );
}

Logger.prototype.message = function( type, level, label, message ) {
	var showStack = true;
	if( level == Logger.LogLevelAny || this.getLogLevel() <= level ) {
		if( level == Logger.LogLevelAny ) {
			showStack = false;
		}
		message = _PrepareMessage( label, showStack, message );	
		if( this.logFile ) {
			return fs.appendFileAsync( this.logFile, _Line( message ) );
		} else {
			return _ConsoleLogAsync( type, message );
		}
	} else {
		return _DoNothingAsync();
	}
}


module.exports = new Logger();
