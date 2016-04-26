define(['./login', './start', './signUp', './animations'], function(login, start, signUp, animations) {
    return function() {
        animations.center('start').bottom('login').top('sign-up');
        login();
        start();
        signUp();
    };
});
