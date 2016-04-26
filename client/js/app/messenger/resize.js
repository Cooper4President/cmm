/*
    gives chat window resize property
*/

define(['jquery'], function($) {
    //enables resizable chat window
    return function(id) {
        //detects drag
        var isDrag = false;
        //size of current container and next;
        var cont;
        //current element
        var elm = $('#' + id);

        //drag delegate
        $('#' + id).find('.resize-bar').mousedown(function(event) {
            isDrag = true;
            cont = elm.width() + elm.next().width();
        });
        $('body').mousemove(function(event) {
            if (isDrag) {
                var left = parseInt(elm.css('left'));
                var minW = parseInt(elm.css('minWidth'));
                var width = event.pageX - left;
                if (event.pageX > left + minW && width < cont - minW) {
                    elm.width(width);
                    elm.next().css('left', event.pageX).width(cont - width);
                }
            }
        }).mouseup(function(event) {
            isDrag = false;
        });
    };
});