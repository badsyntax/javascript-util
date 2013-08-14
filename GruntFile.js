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
      browserGlobal: {
        src: [
          '*/src/**/*.js',
          '!Emailer/src/email.js',
          '!ImageToBase64String/src/imageToBase64String.js'
        ],
        options: {
          specs: '*/spec/**/*.js',
          helpers: [
            'spec/PhantomJSPolyfills.js'
          ]
        }
      },
      browserAMD: {
        src: [
          '*/src/**/*.js',
          '!Emailer/src/email.js',
          '!ImageToBase64String/src/imageToBase64String.js'
        ],
        options: {
          specs: '*/spec/**/*.js',
          helpers: [
            'spec/PhantomJSPolyfills.js'
          ],
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfig: {
              baseUrl: ''
            }
          }
        }
      }
    },
    jasmine_node: {
      specNameMatcher: 'UMDSpec',
      projectRoot: ''
    },
    uglify: {
      Validator: {
        files: {
          'Validator/dest/validator.min.js': ['Validator/src/Validator.js']
        }
      }
    },
    clean: ['docs'],
    jsdoc : {
      dist : {
        src: ['Validator/src/*.js', 'EventEmitter/src/*.js'],
        options: {
          destination: 'docs'
        }
      }
    }
  });

  // Load the tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-jsdoc');


  // Register custom tasks
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['lint', 'jasmine', 'jasmine_node']);
  grunt.registerTask('docs', ['clean', 'jsdoc']);
  grunt.registerTask('build', ['test', 'uglify', 'docs']);
  grunt.registerTask('default', ['build']);
};