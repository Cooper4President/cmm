/*
    To use grunt file, first run 'npm install -g grunt-cli' to install globally 
    and then run 'npm install grunt' to install locally
*/
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
    	},

    	postcss: {
            options: {
                processors: [
                    require('autoprefixer')
                ]
            },
            chat: {
                src: 'client/css/chat.css',
                dest: 'client/css/chat-prefix.css'
            },
            index: {
                src: 'client/css/index.css',
                dest: 'client/css/index-prefix.css'
            }
        }

});

    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.registerTask('default', ['handlebars','postcss']);

};