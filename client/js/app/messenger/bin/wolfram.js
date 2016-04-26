/*
	Prompts help info for user
*/

define(['jquery', 'hbs!templates/message', '../chatSockets'], function($, message, chatSockets) {

    return function(inp, callback) {
        chatSockets.wolframQuery(inp, function(result) {
            console.log(result);
            callback(result[1].subpods[0].image);
        });
    };
});
