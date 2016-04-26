/*
	Prompts help info for user
*/

define(['jquery', 'hbs!templates/message'], function($, message){

	return function(inp, callback){
		var url = window.location.href;
		url = url + '/?q=' + encodeURIComponent(inp);
		callback(url);
	};
});

// function newPopup(url) {
// 	popupWindow = window.open(
// 		url,'popUpWindow','height=300,width=400,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
// }