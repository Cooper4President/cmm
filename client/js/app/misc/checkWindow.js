/** @memberOf jQuery */
/** @module checkWindow */
/**
 * @fileOverview Checks window to make sure elements are aligned properly
 * @author Oliver Ehrhardt
*/

/**
 * Dependencies of the checkWindow module 
 * @function
 * @name Module Dependencies
 * @param {Object} $ - Defines the jquery module dependency
 * @param {Object} _ - Defines the lodash module dependency
 * @param {Object} chatInfo - Defines the chatInfo module
 * @param {Object} menu - Defines the menu module
 * @return {Functions} - Returns the inner return function
 */
define(['jquery', 'lodash', 'messenger/chatInfo', 'menu/menu'], function($, _, chatInfo, menu) {
    return function() {
        $(window).on('resize', function(event) {
            //sets up menu options when window changes
            menu.setUp();

            //aligns viewable chat windows to the window size
            if (chatInfo.center.length > 0) {
                var cont = _.sumBy(chatInfo.center, function(n) {
                    return n.width();
                });
                var scale = $(window).width() / cont;

                //scales viewable windows to fit screen
                var shift = _.union(chatInfo.center, chatInfo.right);
                var lft = 0;
                _.each(shift, function(elm) {
                    var newWidth = elm.width() * scale;
                    elm.css({
                        width: newWidth,
                        left: lft
                    });
                    lft += newWidth;
                });
            }
        });
    };
});
