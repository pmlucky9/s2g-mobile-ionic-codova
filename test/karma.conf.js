// Karma configuration
// Generated on Mon Mar 10 2014 08:25:58 GMT-0700 (PDT)

module.exports = function(config) {
  'use strict';
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '..',
    frameworks: ['jasmine'],
    // list of files / patterns to load in the browser
    files: [
      'www/lib/ionic/js/ionic.js',
      'www/lib/ionic/js/angular/angular.js',
      'www/lib/ionic/js/angular/angular-animate.js',
      'www/lib/ionic/js/angular/angular-sanitize.js',
      'www/lib/ionic/js/angular-ui/angular-ui-router.js',
      'www/lib/ionic/js/ionic-angular.js',
      'www/lib/ionic/js/',
      'test/lib/angular-mocks.js',
      'test/unit/**/*.js',
      'www/js/**/*.js',
      'www/templates/**/*.html'
    ],
    // list of files to exclude
    exclude: [
    ],
    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['spec'],
    // web server port
    port: 9876,

    preprocessors: {
      'www/templates/**/*.html': 'ng-html2js'
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: 'www/'
    },
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: [],
    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
