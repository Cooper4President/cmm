/*
	Sends message to be sent to specific chat window as a command and sends message to server
*/

define([
    'jquery',
    'lodash',
    './chatInfo',
    'hbs!templates/message',
    './commands', //dependency that runs commands
    './chatSockets'
], function($, _, chatInfo, message, commands, chatSockets) { //command first referenced as argument to this module
    //define private function outside of return like this

    //simple get receivers function
    function getReceivers(id) {
        return _.filter(chatInfo.log, function(entry) {
            if (entry.id === id) return entry;
        })[0].receivers;
    }
    //checks if chat box is overflowed
    function checkScrollbar(chatId) {
        var container = $("#" + chatId).find('.container');
        var elt, hasOverflow = (elt = container).innerWidth() > elt[0].scrollWidth;
        if (hasOverflow) container.scrollTop(container[0].scrollHeight);
    }

    //public functions of the module must be returned. 
    //Send only has one public function so we can just return the function itself
    return function(id, inp) {
        var chatId = "#" + id;
        var container = $(chatId).find('.container');
        var cmd = $(chatId).find('.cmd');
        if (inp === undefined) inp = cmd.val();
        if (inp !== "") {
            //update chatlog with new message
            chatInfo.updateChatLog(id, inp);

            var rec = getReceivers(id);
            chatSockets.sendChatMsg($(chatId).data('roomId'), rec, inp);

            //run message as a command and post it to respective chat window
            commands(id, inp, function(result) {
                container.append(message(result)); //since the command module only returns a function we call it like this
            });

            //check scroll bar and clear field
            checkScrollbar(id);
            cmd.val("");
        }
        cmd.focus();
    };
});
