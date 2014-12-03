// var routes = require('./backend/routes.js');
var path = require('path');

module.exports = function(grunt) {
    // plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');

    // configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        express: {
          defaults: {
            options: {
              port: 9000,
              bases: path.resolve('index.html'),
              server: path.resolve('server'),
              serverreload: true
            }
          }
        }
       /* ,

        watch: {
          all: {
            files: 'index.html',
            options: {
              livereload: true
            }
          }
        }*/
    });

    grunt.registerTask('default', ['express', 'watch', 'express-keepalive']);
};