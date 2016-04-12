define(['QUnit', 'socket_io'], function(QUnit, io) {
    var socket = io();

    return function() {
        QUnit.test("testing message sending", function(assert) {
            //todo need way for message to be sent back here for testing
        });
    };
});
