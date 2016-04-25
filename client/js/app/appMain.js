define([
    //'menu/receiver', 
    'messenger/chatSockets',
    'menu/menu',
    'misc/checkWindow',
    'messenger/shifter',
    'menu/friendsList',

    'select2'
], function(chatSockets, menu, checkWindow, shifter, friendsList) {
    //main function
    return function() {

        //send authentication token to server
        chatSockets.sendAuthToken().login();

        //menu button handler
        menu.init();

        //resizes chat(s) on window resize
        checkWindow();

        //initializes chat shifter
        shifter.init();

        $('.friends').find('.search').select2({
            placeholder: 'Search for friends'
        });

        friendsList.init();
    };
});
