/*
	defines chat events for chat windows
*/

define([
    'jquery',
    'lodash',
    './send',
    './chatInfo',
    './enqueueMessenger',
    './sort',
    './resize',
    'menu/menuAnimations',
    'messenger/shifter',
    'misc/misc',
    './chatSockets',

    //jquery plug-ins
    'autogrow',
    'select2'


], function($, _, send, chatInfo, enqueueMessenger, sort, resize, menuAnimations, shifter, misc, chatSockets) {
    var saveCmd;

    //handles down arrow functionality for chat window
    function downArrowHandler(chatId) {
        //loops through chat history and finds next message to display from chat log
        _(chatInfo.log).each(function(entry) {
            if (entry.id === chatId) {
                var cmd = $("#" + entry.id).find('.cmd');
                var index = entry.currentMessage;
                //handles down arrow functionality
                if (index > -1) {
                    if (index === 0) cmd.val(saveCmd);
                    else cmd.val(entry.messages[index - 1]);
                    entry.currentMessage--;
                }
                return;
            }
        });
    }

    //handles up arrow functionality for chat windows
    function upArrowHandler(chatId) {
        //loops through chat history and finds next message to display from chat log
        _(chatInfo.log).each(function(entry) {
            if (entry.id === chatId) {
                var cmd = $("#" + entry.id).find('.cmd');
                var index = entry.currentMessage;
                if (index < entry.messages.length - 1) {
                    if (index === -1) saveCmd = cmd.val();
                    cmd.val(entry.messages[index + 1]);
                    entry.currentMessage++;
                }
                return;
            }
        });
    }

    //handles enter key functionality for chat windows
    function enterKeyHandler(chatId) {
        send(chatId);
        //loops through and sets current message for history loop
        _(chatInfo.log).each(function(entry) {
            if (entry.id === chatId) {
                entry.currentMessage = -1;
                return;
            }
        });
    }


    //handles receiver set up and execution
    function receiverHandler(html) {
        $('.head').find('.submit').on('click', function(event) {


            //create chat id and pull chat receivers
            var chatId = html.attr('id');
            var rec = html.find('.receivers').val();

            //finds if receivers already have active chat window displayed
            var found = false;
            _.each(chatInfo.log, function(entry) {
                if (misc.checkIfEqual(rec, entry.receivers)) found = true;
            });

            //check if valid input
            if (!found && rec !== null) {

                chatSockets.requestRoomId(rec, true, function(id) {
                    html.data('roomId', id);
                });
                menuAnimations.showButton();

                //joins receivers into formatted list
                var recFormat = _.join(rec, ", ");

                //replaces receiver elements with formatted title
                html.find('.head').find('.submit').remove();
                html.find('.head').find('.select2').remove();
                html.find('.head').find('.receivers').remove();
                html.find('.head').append("<div class='title'>" + recFormat + "</div>");

                //add new log entry
                chatInfo.newChatLogEntry(chatId, rec);

                //gives window sortable property
                sort(chatId);

                //focus on new chat window
                html.find('.head').find('input').focus().autogrow();

                //grants key down functions to chat window
                keyDownHandler(html);
            } else {
                alert('user name(s) invalid');
                return false;
            }

        });

    }

    //gives chat window ability to receiver input
    function keyDownHandler(html) {
        html.find('.cmd').prop('disabled', false).focus().keydown(function(event) {
            var chatId = $(this).closest('.chat').attr('id');
            //enter key submit
            if (event.keyCode === 13) {
                event.preventDefault();
                enterKeyHandler(chatId);
            }

            //up arrow to go through chat log
            if (event.keyCode === 38) {
                event.preventDefault();
                upArrowHandler(chatId);
            }

            //down arrow to go through chat log
            if (event.keyCode === 40) {
                event.preventDefault();
                downArrowHandler(chatId);
            }
        }).autogrow();
    }


    //sets up events for chat window
    return function(html, group) {
        if(group){
            receiverHandler(html, group);
            //initializes select2 plug in
            $('.receivers').select2({
                placeholder: "Select chat members"
            });
            html.find('.head').find('input').focus();
        }else{
            html.find('.cmd').focus();
            menuAnimations.showButton();
            keyDownHandler(html);
        } 

        //gives chat window resize property
        resize(html.attr('id'));


        //displays shifter if needed
        if (chatInfo.left.length > 0) shifter.showRight();
        if (chatInfo.right.length > 0) shifter.showLeft();



        //remove messenger if needed
        html.find(".remove-messenger").on("click", function(event) {
            enqueueMessenger(html);
        });
    };
});
