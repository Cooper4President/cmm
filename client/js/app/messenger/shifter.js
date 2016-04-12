/*
	Defines how shifters work for shifting between overflowed windows
*/

define(['jquery', 'lodash', './chatInfo'], function($, _, chatInfo) {

    return {

        //hides or shows shifters
        showLeft: function() {
            $('.shift-left').css('right', 0);
        },
        showRight: function() {
            $('.shift-right').css('left', 0);
        },
        hideLeft: function() {
            $('.shift-left').css('right', '-100%');
        },
        hideRight: function() {
            $('.shift-right').css('left', '-100%');
        },
        leftShift: function() {
            //configure chat windows to account of shift
            var pop = _.remove(chatInfo.center, function(n) {
                return n.is(_.first(chatInfo.center));
            })[0];
            var push = _.remove(chatInfo.right, function(n) {
                return n.is(_.first(chatInfo.right));
            })[0];
            push.width(pop.width());
            chatInfo.center.push(push);
            chatInfo.left.push(pop);

            //shift needed windows to the left
            pop.animate({
                left: -pop.width()
            }, chatInfo.animationDuration);

            var lft = 0; //-_.last(chatInfo.left).width();
            _.each(chatInfo.center, function(elm) {
                elm.animate({
                    left: lft
                }, chatInfo.animationDuration);
                lft += elm.width();
            });

        },
        rightShift: function() {

            //configure chat windows to account of shift
            var pop = _.remove(chatInfo.center, function(n) {
                return n.is(_.last(chatInfo.center));
            })[0];
            var push = _.remove(chatInfo.left, function(n) {
                return n.is(_.last(chatInfo.left));
            })[0];
            push.width(pop.width());
            chatInfo.center.unshift(push);
            chatInfo.right.unshift(pop);

            //shift needed windows to the right
            pop.animate({
                left: $('body').width()
            }, chatInfo.animationDuration);


            var lft = 0;
            _.each(chatInfo.center, function(elm) {
                elm.animate({
                    left: lft
                }, chatInfo.animationDuration);
                lft += elm.width();
            });
        },

        //initializes shifter functions
        init: function() {
            var curr = this;

            //delegate for shifting to the left
            $('.shift-left').on('click', function(event) {
                curr.leftShift();
                //hide or show shifters according to configuration
                if (chatInfo.right.length === 0) curr.hideLeft();
                if (chatInfo.left.length > 0) curr.showRight();
            });

            //delegate for shifting to the right
            $('.shift-right').on('click', function(event) {

                curr.rightShift();
                //hide or show shifters according to configuration
                if (chatInfo.left.length === 0) curr.hideRight();
                if (chatInfo.right.length > 0) curr.showLeft();
            });
        }
    };
});
