define([
    //'menu/receiver', 
    'messenger/chatSockets',
    'menu/menu',
    'misc/checkWindow',
    'messenger/shifter',

    'select2'
], function(chatSockets, menu, checkWindow, shifter) {
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


    };
});
