/*
    To use grunt file, first run 'npm install -g grunt-cli' to install globally 
    and then run 'npm install grunt' to install locally
*/
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            options: {
                plugins: [
                    new(require('less-plugin-autoprefix'))(),
                    new(require('less-plugin-clean-css'))()
                ]
            },
            menu: {
                src: 'client/css/less/menu.less',
                dest: 'client/css/prefix/menu-prefix.css'
            },
            chat: {
                src: 'client/css/less/chat.less',
                dest: 'client/css/prefix/chat-prefix.css'
            },
            index: {
                src: 'client/css/less/index.less',
                dest: 'client/css/prefix/index-prefix.css'
            }
        },
        'jsbeautifier': {
            'default': {
                src: ['client/js/app/**/*.js', 'client/js/home/**/*.js']
            },
            'app': {
                src: ['client/js/app/**/*.js']
            },
            'home': {
                src: ['client/js/home/**/*.js']
            }
        },
        watch: {
            css: {
                files: ['client/css/less/*.less'],
                tasks: ['less']
            },
            app: {
                files: ['client/js/app/**/*.js'],
                tasks: ['jsbeautifier']
            },
            home: {
                files: ['client/js/home/**/*.js'],
                tasks: ['jsbeautifier']
            },
        }

    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('default', ['less', 'jsbeautifier']);

};