/*
	Defines how to add a new chat windows
*/

define([
    'jquery',
    'lodash',
    './chatInfo',
    'hbs!templates/messenger',
    './chatEvents',
    'misc/user',
    './shifter',
    './chatSockets'

], function($, _, chatInfo, messenger, chatEvents, user, shifter, chatSockets) {


    //scales to add if chats are within chats per window threshold
    function scaleToAdd(html) {

        //appends chat window
        $('.messenger-container').prepend(html);

        //only executes if there is already a chat window displayed
        if (chatInfo.center.length > 0) {
            var
                shrink = $('body').width() - html.width(),
                scale = shrink / $('body').width(), //scale for chat windows
                minW = parseInt(html.css('minWidth')), //pulls minimum width of chat window 
                widths = _.map(chatInfo.center, function(n) {
                    return n.width() * scale;
                }), //scaled chat window widths
                minCount = 0, //number of windows with minimum width after scale
                diff = 0, //offset of scale accounting for minimum width to distribute
                lft = html.width(); //starting offset

            //find all windows with minimum width after scale
            _.each(widths, function(ent, ind) {
                if (ent <= minW) {
                    diff += minW - ent;
                    widths[ind] = minW;
                    minCount++;
                }
            });

            //distribute offset from min width windows
            var dist = diff / (widths.length - minCount);
            if (dist) {
                _.each(widths, function(ent, ind) {
                    if (ent !== minW) widths[ind] -= dist;
                });
            }

            //distribute widths to each window respectively
            _.each(chatInfo.center, function(elm, ind) {
                elm.animate({
                    width: widths[ind],
                    left: lft
                }, chatInfo.animationDuration);
                lft += widths[ind];
            });
        }

        //animates new window show and sets up chat info
        html.animate({
            left: 0
        }, chatInfo.animationDuration);
        chatInfo.center.unshift(html);
    }

    //adds window if chats per window is above threshold
    function shiftToAdd(html) {

        //sets up chat configuration for overflow
        //html.width(_.last(chatInfo.center).width());
        _.first(chatInfo.center).before(html);
        chatInfo.left.push(html);
        //shifts each window in center and right views to the right
        shifter.rightShift();
    }

    //sets up chat window to be added
    return function(rec) {
        chatInfo.count++;
        chatInfo.id++;
        var 
            chatId = "chat-" + chatInfo.id,
            context = {id: chatId},
            group = false;
        if(rec === undefined){
            context.friends = user.people;
            group = true;
        }else{
            chatInfo.newChatLogEntry(chatId, rec);
            context.receivers = _.join(rec, ", ");
            chatSockets.requestRoomId(rec, true, function(id) {
                html.data('roomId', id);
            });
        }
        var html = $(messenger(context)).css({ //get hmtl element of chat window
            'width': chatInfo.defaultWidth(),
            'left': -chatInfo.defaultWidth()
        });
        //checks whether to shift or scale to add
        if (chatInfo.count > chatInfo.chatsPerWindow) shiftToAdd(html);
        else scaleToAdd(html);

        //gives chat window events
        chatEvents(html, group);
        return chatId;
    };
});
