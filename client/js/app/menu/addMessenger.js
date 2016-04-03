define([
	'jquery', 
	'lodash',
	'./menuAnimations', 
	'hbs!templates/list', 
	'messenger/queueMessenger'
	], function($, _, menuAnimations, list, queueMessenger){
	
	return function(){
		$('.add-messenger-button').click(function(event){
			menuAnimations.hideMenu();
			queueMessenger();
		});
	}
});