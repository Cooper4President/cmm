module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    handlebars: {
	    all: {
	        files: {
	            'client/messenger-template.js': 'client/messenger-template.handlebars',
	        },
	        options: {
	        	namespace: 'Handlebars.templates'
	        }
	    }
	}

});

  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.registerTask('default', ['handlebars']);

};