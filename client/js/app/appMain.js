define([
    //'menu/receiver', 
    'messenger/chatSockets',
    'menu/menu',
    'misc/checkWindow',
    'messenger/shifter'
], function(chatSockets, menu, checkWindow, shifter) {
    //main function
    return function() {

        //send authentication token to server
        chatSockets.sendAuthToken();

        //menu button handler
        menu.init();

        //resizes chat(s) on window resize
        checkWindow();

        //initializes chat shifter
        shifter.init();
    };
});
