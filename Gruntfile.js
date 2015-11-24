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
    // Express: To launch the Express server
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
      prod: {
        options: {
          script: 'dist/server/app.js'
        }
      }
    },


    // -----
    // Clean: Cleans out the distribution folder
    clean: {
      dist: {
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
    // Concurrent: Speed up build process by running tasks in parallel
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
      dist: [
        'sass',
        'imagemin',
        'svgmin'
      ]
    },



    // ----
    // Node Inspector: Debugging
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },


    // ----
    // Nodemon: run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: 'server/app.js',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:<%= express.options.port %>/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },


    // ----
    // Rev: Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            'dist/public/{,*/}*.js',
            'dist/public/{,*/}*.css',
            'dist/public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            'dist/public/assets/fonts/*'
          ]
        }
      }
    },


    // ----
    // Open
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },


    // ----
    // ngAnnotate: Allow the use of non-minsafe AngularJS files.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '*/**.js',
          dest: '.tmp/concat'
        }]
      }
    },


    // ----
    // ngtemplates: Package all the html partials into a single javascript payload
    ngtemplates: {
      options: {
        // This should be the name of your apps angular module
        module: 'MyApp',
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        usemin: 'app/app.js'
      },
      main: {
        cwd: 'client',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/templates.js'
      },
      tmp: {
        cwd: '.tmp',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/tmp-templates.js'
      }
    },



    // ----
    // Minifiers
    useminPrepare: {
      html: ['client/index.html'],
      options: {
        dest: 'dist/public'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['dist/public/{,*/}*.html'],
      css: ['dist/public/{,*/}*.css'],
      js: ['dist/public/{,*/}*.js'],
      options: {
        assetsDirs: [
          'dist/public',
          'dist/public/assets/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          js: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'client/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: 'dist/public/assets/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'client/assets/images',
          src: '{,*/}*.svg',
          dest: 'dist/public/assets/images'
        }]
      }
    },


    // ----
    // Copy: Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'client',
          dest: 'dist/public',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'assets/images/{,*/}*.{webp}',
            'assets/fonts/**/*',
            'index.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: 'dist/public/assets/images',
          src: ['generated/*']
        }, {
          expand: true,
          dest: 'dist',
          src: [
            'package.json',
            'server/**/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: 'client',
        dest: '.tmp/',
        src: ['{app,components}/**/*.css']
      }
    },


    // ----
    // cdnify: Replace Google CDN references
    cdnify: {
      dist: {
        html: ['dist/public/*.html']
      }
    },


    // ----
    // Watch: Watches files for changes
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
    },


    // ----
    // BuildControl
    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      heroku: {
        options: {
          remote: 'git@heroku.com:name-of-my-app-here.git',
          branch: 'master'
        }
      },
      openshift: {
        options: {
          remote: 'openshift',
          branch: 'master'
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



  grunt.registerTask('build', [
    'clean:dist',
    'injector:sass',
    'concurrent:dist',
    'injector',
    'wiredep',
    'useminPrepare',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);


}
