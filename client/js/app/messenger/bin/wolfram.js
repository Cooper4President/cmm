/*
    Prompts help info for user
*/

define(['jquery', 'hbs!templates/message', 'misc/commandSockets'], function($, message, commandSockets) {

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
