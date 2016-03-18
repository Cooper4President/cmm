/*
    To use grunt file, first run 'npm install -g grunt-cli' to install globally 
    and then run 'npm install grunt' to install locally
*/
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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

            menu: {
                src: 'client/css/menu.css',
                dest: 'client/css/menu-prefix.css'
            },

            index: {
                src: 'client/css/index.css',
                dest: 'client/css/index-prefix.css'
            }
        }

});

    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.registerTask('default', ['postcss']);

};