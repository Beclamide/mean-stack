'use strict';

module.exports = function(grunt) {
  

  require('load-grunt-tasks')(grunt);


  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // -----
    // Environment
    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },

    // -----
    // Express
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server/app.js',
          debug: true
        }
      },
      prod: { // we'd only need this if we're building for production (which we're not in this demo)
        options: {
          script: 'dist/server/app.js'
        }
      }
    },


    // -----
    // Clean
    clean: {
      dist: { // we'd only need this if we're building for production (which we're not in this demo)
        files: [{
          dot: true,
          src: [
            '.tmp',
            'dist/*',
            '!dist/.git*',
            '!dist/.openshift',
            '!dist/Procfile'
          ]
        }]
      },
      server: '.tmp'
    },



    // -------
    // Concurrent
    concurrent: {
      server: [
        'sass'
      ],
      test: [
        'sass'
      ],
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [ // we'd only need this if we're building for production (which we're not in this demo)
        'sass',
        'imagemin',
        'svgmin'
      ]
    },


    // ----
    // Open
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },

    // ----
    // Watch
    watch: {
      injectJS: {
        files: [
          'client/{app,components}/**/*.js',
          '!client/{app,components}/**/*.test.js',
          '!client/app/app.js'
        ],
        tasks: ['injector:scripts']
      },
      injectCss: {
        files: [
          'client/{app,components}/**/*.css'
        ],
        tasks: ['injector:css']
      },
      mochaTest: {
        files: ['server/**/*.test.js'],
        tasks: ['env:test', 'mochaTest']
      },
      jsTest: {
        files: [
          'server/api/**/*.js',
          'client/{app,components}/**/*.js'
        ],
        tasks: ['newer:jshint:all', 'karma']
      },
      injectSass: {
        files: [
          'client/{app,components}/**/*.{scss,sass}'
        ],
        tasks: ['injector:sass']
      },
      sass: {
        files: [
          'client/{app,components}/**/*.{scss,sass}'
        ],
        tasks: ['sass', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,client}/{app,components}/**/*.css',
          '{.tmp,client}/{app,components}/**/*.html',
          '{.tmp,client}/{app,components}/**/*.js',
          '!{.tmp,client}{app,components}/**/*.test.js',
          'client/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true
        }
      }
    },


    // Test settings ------
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    mochaTest: {
      options: {
        reporter: 'list'
      },
      src: ['server/**/*.test.js']
    },

    // ----
    // Make sure yur code doesn't suck

    jshint: {
      options: {
        jshintrc: 'client/.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: 'server/.jshintrc'
        },
        src: [
          'server/**/*.js',
          '!server/**/*.test.js'
        ]
      },
      serverTest: {
        options: {
          jshintrc: 'server/.jshintrc-test'
        },
        src: ['server/**/*.test.js']
      },
      all: [
        'client/{app,components}/**/*.js',
        '!client/{app,components}/**/*.test.js',
        'server/api/**/*.js',
        '!server/api/**/*.test.js'
      ],
      test: {
        src: [
          'client/{app,components}/**/*.test.js'
        ]
      }
    },


    // -----
    // Compiles Sass to CSS
    sass: {
      server: {
        options: {
          loadPath: [
            'client/bower_components',
            'client/app',
            'client/components'
          ],
          compass: false
        },
        files: {
          '.tmp/app/app.css': 'client/app/app.scss'
        }
      }
    },



    // ------
    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: 'client/index.html',
        ignorePath: 'client/',
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, /bootstrap.css/]
      }
    },



    // ------
    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: '{,*/}*.css',
          dest: '.tmp/'
        }]
      }
    },



    // ------
    // Inject application script files into index.html (doesn't include bower)
    injector: {
      options: {

      },
      scripts: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          'client/index.html': [
            ['{.tmp,client}/{app,components}/**/*.js',
              '!{.tmp,client}/app/app.js',
              '!{.tmp,client}/{app,components}/**/*.test.js',
              '!{.tmp,client}/{app,components}/**/*.mock.js'
            ]
          ]
        }
      },

      // Inject component scss into app.scss
      sass: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/app/', '');
            filePath = filePath.replace('/client/components/', '');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          'client/app/app.scss': [
            'client/{app,components}/**/*.{scss,sass}',
            '!client/app/app.{scss,sass}'
          ]
        }
      },

      // Inject component css into index.html
      css: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          'client/index.html': [
            'client/{app,components}/**/*.css'
          ]
        }
      }
    }

  });



  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function() {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function() {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });


  grunt.registerTask('serve', function(target) {
    grunt.task.run([
      'clean:server',
      'injector:sass',
      'concurrent:server',
      'injector',
      'wiredep',
      'autoprefixer',
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });




  grunt.registerTask('test', function(target) {
    if (target === 'server') {
      return grunt.task.run([
        'mochaTest'
      ]);
    } else if (target === 'client') {
      return grunt.task.run([
        'clean:server',
        'injector:sass',
        'concurrent:test',
        'injector',
        'autoprefixer',
        'karma'
      ]);
    } else if (target === 'e2e') {
      return grunt.task.run([
        'clean:server',
        'injector:sass',
        'concurrent:test',
        'injector',
        'wiredep',
        'autoprefixer',
        'express:dev',
        'protractor'
      ]);
    } else grunt.task.run([
      'test:server',
      'test:client'
    ]);
  });


}
