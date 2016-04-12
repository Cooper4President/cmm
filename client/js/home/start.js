define(['jquery', './animations'], function($, animations) {
    return function() {
        //shows login window
        $('.login-op').on('click', function(event) {
            animations.top('start').center('login');
        });
        //shows sign up window
        $('.sign-up-op').on('click', function(event) {
            animations.bottom('start').center('sign-up');
        });
    };
});
