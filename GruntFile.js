module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        '*.js',
        '*/src/**/*.js',
        '*/spec/**/*.js'
      ],
      options: {
        globals: {
          console: false,
          document: false,
          require: false
        }
      }
    },
    jasmine: {
      src: [
        '*/src/**/*.js',
        '!Emailer/src/email.js',
        '!ImageToBase64String/src/imageToBase64String.js'
      ],
      options: {
        specs: '*/spec/**/*.js',
        helpers: 'Tests/PhantomJSPolyfills.js'
      }
    }
  });

  // Load the tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Register custom tasks
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['lint', 'jasmine']);
  grunt.registerTask('default', ['test']);
};