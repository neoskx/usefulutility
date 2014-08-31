'use strict';

module.exports = function(grunt) {

  // Load all grunt plugins that configure in `package.json`
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-jsdoc');

  /**
   * Load the custom project configuration file
   * Because each project is different, so user can define their project's information in this file
   */
  var projectConfig = require('./project.config.js');

  var commonConfig = {
    /**
     * We read our `package.json` file so we can access the package name and version.
     * It's already there, we don't need to repeat here. This can reduce our maintain cause.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * `meta` store all basic information that will be used in js, css, html... files
     * For example, `banner` is the comment that is placed at the top of our compiled files.
     */
    meta: {
      banner: '/*! \n' + ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' + ' * Build Time: <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>\n' + ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' + ' */\n'
    },

    /**
     * `clean`: Clean files and folders
     * https://www.npmjs.org/package/grunt-contrib-clean
     */
    clean: {
      development:['<%= project_config.build_dir %>'],
      production:['<%= project_config.production_dir %>'],
      apiDoc:['<%= project_config.api_dir %>']
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      options: {
        force: true,
        reporter: 'checkstyle',
        reporterOutput: '<%= project_config.log_dir %>jshint-reporter.xml'
      },
      app_js: ['<%= project_config.app_files.app_js.src %>']
    },

    /**
     * `concat`: Concatenate files
     * https://www.npmjs.org/package/grunt-contrib-concat 
     */
    concat:{
      development: {
        options:{
          banner: '<%= meta.banner %>'
        },
        src: ['<%= project_config.app_files.app_js.src %>'],
        dest: '<%= project_config.app_files.app_js.dest %>'
      }
    },

    /**
     * `less`: Compile LESS files to CSS
     * https://www.npmjs.org/package/grunt-contrib-less
     */
    less:{
      development: {
        options: {
          compress: false
        },
        files: [{
          '<%= project_config.app_files.less.dest %>': '<%= project_config.app_files.less.src %>'
        }]
      },
      production: {
        options: {
          compress: true
        },
        files: [{
          '<%= project_config.app_files.less.dest %>': '<%= project_config.app_files.less.src %>'
        }]
      }
    },

    /**
     * `copy`: Copy files and folders
     * https://npmjs.org/package/grunt-contrib-copy
     */
    copy: {
      development:{
        files:[
          {
            expand: true,
            cwd: '<%= project_config.source_dir %>',
            src: ['*.html','<%= project_config.app_files.asset %>', '<%= project_config.vendor%>'],
            dest: '<%= project_config.build_dir %>'
          }
        ]
      },
      production:{
        files: [{
          expand: true,
          cwd: '<%= project_config.build_dir %>',
          src: ['**/*'],
          dest: '<%= project_config.production_dir %>'
        }]
      }
    },

    /**
     * `uglify`: JavaScript parser, mangler/compressor and beautifier toolkit
     * https://www.npmjs.org/package/uglify-js
     */
    uglify: {
      development: {
        options: {
            report: false,
            mangle: false,
            compress: false,
            beautify: true,
            preserveComments: true
        },
        files:[{
          src: ['<%= project_config.build_dir %><%= pkg.name %>.js'],
          dest: '<%= project_config.build_dir %><%= pkg.name %>.min.js'
        }]
      },
      production: {
        options: {
            mangle: false,
            preserveComments: 'some',
            sourceMap: false
        },
        files:[{
          src: ['<%= project_config.build_dir %><%= pkg.name %>.js'],
          dest: '<%= project_config.build_dir %><%= pkg.name %>.min.js'
        }]
      }
    },

    /**
     * `connect`: Start a connect web server
     * https://www.npmjs.org/package/grunt-contrib-connect
     */
    connect: {
      project: {
        options: {
          port: 9000,
          hostname: '127.0.0.1',
          base: '<%= project_config.build_dir %>',
          open: true
        }
      },
      api: {
        options: {
          port: 9001,
		  hostname: '127.0.0.1',
          base: '<%= project_config.api_dir %>',
          open: true
        }
      }
    },

    /**
     * `notify`: Automatic Notifications when Grunt tasks fail
     * https://github.com/dylang/grunt-notify
     */
    notify: {
      release: {
        options: {
          title: 'Release success',
          message: 'Generate release build success. Please get it in "release" folder.'
        }
      },
      build:{
        options: {
          title: 'Build success',
          message: 'Build project successful. Please get it in "build" folder'
        }
      },
      project:{
        options: {
          title: 'Start project Server',
          message: 'Server is ready! You can go to http://localhost:9000'
        }
      },
      api:{
        options: {
          title: 'Start API Document server',
          message: 'Server is ready! You can go to http://localhost:9001'
        }
      }
    },

    /**
     * `qunit`: Run QUnit unit tests in a headless PhantomJS instance.
     * https://www.npmjs.org/package/grunt-contrib-qunit
     */
    qunit:{
      all:['test/unit/qunit.html']
    },

    /**
     * `jsdoc`: Integrates jsdoc3 generation into your Grunt build
     * https://www.npmjs.org/package/grunt-jsdoc
     */
    jsdoc:{
      dist:{
        src:['<%= project_config.app_files.app_js.src%>', 'README.md'],
        dest: '<%= project_config.api_dir %>',
        options:{
          verbose: true,
          configure: 'jsdoc-template/jsdoc-jaguar/conf.json',
          template: 'jsdoc-template/jsdoc-jaguar/',
          private: false
        }
      }
    },

    /**
     * `watch`: Run predefined tasks whenever watched file patterns are added, changed or deleted
     * https://npmjs.org/package/grunt-contrib-watch
     */
    watch:{
      development:{
        files:['<%= project_config.source_dir %>**/*'],
        tasks:['build']
      }
    }
      
  };

  // Project configuration.
  grunt.initConfig(grunt.util._.extend(commonConfig, projectConfig));

  grunt.registerTask('development',['build', 'connect:project', 'notify:project', 'watch'] );
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['clean:development', 'jshint', 'concat', 'less:development', 'copy:development', 'uglify:development', 'notify:build']);
  grunt.registerTask('release', ['clean:development', 'clean:production', 'jshint', 'concat', 'less:production', 'copy:development', 'uglify:production', 'copy:production', 'notify:release']);
  grunt.registerTask('api-doc', ['clean:apiDoc', 'jsdoc', 'notify:api']);

};