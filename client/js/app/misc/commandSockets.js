/** @memberOf jQuery */
/** @module commandSockets */
/**
 * @fileOverview Checks window to make sure elements are aligned properly
 * @author Oliver Ehrhardt
 * @author Morgan Allen
*/


/**
 * Dependencies of the commandSockets module 
 * @function
 * @name Module Dependencies
 * @param {Object} $ - Defines the jquery module dependency
 * @param {Object} io - defines the socket.io module dependency
 * @return {Functions} - Returns the inner return function
 */
define(['jquery', 'socket_io'], function($, io){
	var socket = io();
    /**
     * Defines the query from the wolfram socket to the wolfram alpha servers
     * @function
     * @name ReturnFunction
     * @param {String} inp - The raw user input string
     * @param {AnonymousFunction} callback - callback function once the commands have been executed and finished
     * @return {Object} returns the wolfram alpha query callback
     */

	return {
        wolframQuery: function(inp, callback) {
            socket.emit('wolfram', inp);
            socket.on('wolfram success', function(result) {
                console.log(result);
                callback(result);
                socket.removeListener('wolfram success'); //remove listener after use
            });
        }
	};

});