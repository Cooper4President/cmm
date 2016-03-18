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
                src: 'client/css/styles/chat.css',
                dest: 'client/css/prefix/chat-prefix.css'
            },

            menu: {
                src: 'client/css/styles/menu.css',
                dest: 'client/css/prefix/menu-prefix.css'
            },

            index: {
                src: 'client/css/styles/index.css',
                dest: 'client/css/prefix/index-prefix.css'
            }
        }

});

    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.registerTask('default', ['postcss']);

};