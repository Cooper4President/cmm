/** @memberOf jQuery */

/** @module wolfram */

/**
 * @fileOverview wolfram.js opens the wolframQuery socket to query wolfram alpha for the result of the message string
 * @author Morgan Allen <moal8410@colorado.edu>
 */

/**
 * Dependencies of the wolfram module 
 * @function
 * @name Module Dependencies
 * @param {Object} $ - Defines the jquery module dependency
 * @param {Object} message - Defines the message handlebars template
 * @param {Object} commandSockets - Defines the commandSockets module where the wolframQuery socket is defined
 * @return {Functions} - Returns the inner return function
 */
define(['jquery', 'hbs!templates/message', 'misc/commandSockets'], function($, message, commandSockets) {
    /**
     * Module performs a wolfram alpha query, and then parses and returns part of the result object array
     * @function
     * @name ReturnFunction
     * @param {String} inp - The raw user input string
     * @param {AnonymousFunction} callback - callback function once the commands have been executed and finished
     * @return {Object} data - Returns the text and image of the wolfram alpha query result
     */

    return function(inp, callback) {
        commandSockets.wolframQuery(inp, function(result) {
            console.log(result);
            var data = {
                text: result[1].subpods[0].text,
                image: result[1].subpods[0].image
            };
            callback(data);
        });
    };
});
