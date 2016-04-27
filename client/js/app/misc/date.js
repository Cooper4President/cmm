
/** @memberOf jQuery */
/** @module date */
/**
 *
 * @fileOverview date module returns today's date formatted
 * @author Morgan Allen <moal8410@colorado.edu>
 */
define(function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    var today = mm + '/' + dd + '/' + yyyy;
    return today;
});
