/** @memberOf jQuery */
/** @module misc */
/**
 *
 * @fileOverview miscellaneous functions for use elsewhere
 * @author Oliver Ehrhardt
 */


/**
 * Dependencies of the misc module 
 * @function
 * @name Module Dependencies
 * @param {Object} $ - Defines the jquery module dependency
 * @param {Object} _ - Defines the lodash dependency
 * @param {Object} _ - Defines the chatInfo
 * @return {Function} - Returns the inner return function
 */
define(['jquery', 'lodash', 'messenger/chatInfo'], function($, _, chatInfo) {
    return {
        /**
         * checks if two arrays are equal
         * @function
         * @param {Array} arr1 -first array
         * @param {Array} arr2 - second array
         * @return {Bool} Returns true if arrays are equal, false otherwise
         */
        checkIfEqual: function(arr1, arr2) {
            arr1.sort();
            arr2.sort();
            if (arr1.length != arr2.length) return false;
            for (i = 0; i < arr1.length; i++)
                if (arr1[i] !== arr2[i]) return false;
            return true;
        },
        
        /**
         * swaps two values of array
         * @function
         * @param {String} a -first value
         * @param {String} b - second value
         */
        swap: function(a, b) {
            var ai, bi;
            _.each(chatInfo.center, function(elm, ind) {
                if (elm.is(a)) {
                    ai = ind;
                } else if (elm.is(b)) {
                    bi = ind;
                }
            });

            chatInfo.center[ai] = b;
            chatInfo.center[bi] = a;
        }
    };
});