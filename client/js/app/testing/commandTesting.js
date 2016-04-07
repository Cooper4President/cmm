/*
	Only works on text manipulation commands, Look at User Acceptance Tests for other commands
*/

define(['QUnit', 'messenger/commands', 'misc/date', 'misc/user'], function(QUnit, commands, date, user){
	return function(){
		//tests command module
		QUnit.test("command testing", function(assert){
			var testId = "chat-1";


			//check if calling username
			assert.equal(commands(testId, "lol").username, user.name);

			//test if calling date
			assert.equal(commands(testId, "--date").message, date);

			//test color function
			assert.equal(commands(testId, "test --color blue").message, "<font color=\"blue\">test  </font>");

			//test bold function
			assert.equal(commands(testId, "test --bold").message, "<b>test </b>");

			//test italic function with alias
			assert.equal(commands(testId, "test --italic").message, "<i>test </i>");
			assert.equal(commands(testId, "test --italics").message, "<i>test </i>");

			//test font size with alias
			assert.equal(commands(testId, "test --fontsize 3").message, "<font size=\"3\">test  </font>");
			assert.equal(commands(testId, "test --font 3").message, "<font size=\"3\">test  </font>");


		});

	};
});