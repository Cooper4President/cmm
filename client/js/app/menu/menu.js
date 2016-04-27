/*
	Module defines event handlers for options
*/

define([
    'jquery',
    './menuAnimations',
    'messenger/queueMessenger',
    './menuSockets',
    'messenger/chatSockets',
    //jquery plug ins
    'jqueryui'
], function($, menuAnimations, queueMessenger, menuSockets, chatSockets) {

    return {
        //sets up menu options to be evenly across length of window
        setUp: function() {
            var step = $(window).width() / ($('.menu-item').length + 1);
            var lft = step;
            $('.menu-item').each(function() {
                $(this).css({
                    left: lft - $(this).width()
                });
                lft += step;
            });
        },

        //initializes menu functions
        init: function() {
            this.setUp();
            menuAnimations.showMenu();
            var toolTipOptions = {
                track: true,
                show: {
                    delay: 750,
                    effect: "fade"
                },
                hide: {
                    effect: "none"
                }
            };

            //adds tool tip to menu item
            $('.menu-item').tooltip(toolTipOptions);

            //delegates menu click
            $(".menu").tooltip(toolTipOptions).click(function(event) {
                menuAnimations.showMenu().hideButton();
            });

            //delegates escape out of menu by pressing escape
            $('body').keydown(function(event) {
                if (event.keyCode === 27) {
                    menuAnimations.hideMenu().showButton();
                }
            });

            // $.notify();
            $(document).on('click', '.notifyjs-corner', function(event){
                menuAnimations.hideMenu().showButton();
                var rec = $(event.target).html().match(/^\w+/);
                queueMessenger(rec);
                chatSockets.requestChatRoomLog($('.notifyjs-corner').data('roomId'));
            });

            //delegates escape out of menu by clicking background
            $('.backdrop').click(function(event) {
                menuAnimations.hideMenu().showButton();
            });

            //delegates add messenger menu option click event
            $('.add-messenger-button').click(function(event) {
                menuAnimations.hideMenu();
                queueMessenger();
            });

            //delegates logout button
            $('.logout-button').click(function(event) {
                menuSockets.logout();
            });
        }
    };
});
