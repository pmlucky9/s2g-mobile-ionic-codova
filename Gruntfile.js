/*
 * Default Gruntfile for AppGyver Steroids
 * http://www.appgyver.com
 *
 * Licensed under the MIT license.
 */
module.exports = function(grunt) {
  'use strict';
  grunt.loadNpmTasks('grunt-steroids');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  /* compile sass */
  grunt.initConfig({
    watch: {
      sass: {
        files: ['www/sccs/{,**/}*.{scss,sass}'],
        tasks: ['sass']
      }
    },
    sass: {
      dist: {
        files: {
          'dist/css/app.css': 'www/scss/app.scss'
        }
      }
    }
  });

  /* Javascript Linting */
  grunt.extendConfig({
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      all: ['Gruntfile.js', 'www/js/**.js', 'www/lib/**.js', 'test/**/*.js', '!test/lib/**/*.js']
    }
  });

  grunt.registerTask('default', ['jshint', 'steroids-make', 'sass']);
};