define(['jquery', 'lodash','misc/people', './menuAnimations', 'hbs!templates/list'], function($, _, people, menuAnimations, list){
	
	function setUp(){
		$('.friends-list').append(list({items: people}));
	}

	return function(){
		setUp();
		$('.friends-list-button').on('click', function(event){
			menuAnimations.hideMenu(false);
			menuAnimations.showFriends();
		});
	}
});