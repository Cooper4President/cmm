
/** @memberOf jQuery */
/** @module help */
/**
 *
 * @fileOverview module appends the help.txt file to the chat window
 * @author Morgan Allen <moal8410@colorado.edu>
 */


/**
 * Dependencies of the helpmodule 
 * @function
 * @name Module Dependencies
 * @param {Object} $ - Defines the jquery module dependency
 * @param {Object} message - Defines the message handlebars template
 * @return {Function} - Returns the inner return function
 */
define(['jquery', 'hbs!templates/message'], function($, message) {
    /**
     * Appends the help data to the chat container
     * @function
     * @param {Integer} chatId - the id of the chat container
     * @param {data} - the data from the help.txt file
     */
    function append(chatId, data) {
        $("#" + chatId).find('.container').append(message({
            help: data
        }));
    }
    
    /**
     * Return function performs an ajax call to get the data from help.txt
     * @function
     * @name ReturnFunction
     * @param {Integer} chatId - the id of the chat container
     */
    return function(chatId) {
        //ajax call gets help info from help.txt
        $.ajax({
            context: this,
            url: 'help.txt',
            dataType: 'text',
            success: function(data) {
                console.log('sent data');
                data = data.replace(/\n/g, '<br />');
                append(chatId, data);
            },
            error: function(data) {
                console.log("Error with help");
            }
        });
    };
});
