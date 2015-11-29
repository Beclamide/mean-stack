'use strict';

module.exports = function(grunt) {


  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch(e) {
    localConfig = {};
  }



  // Load all of the tasks in package.json
  require('load-grunt-tasks')(grunt);



  /*

    Options (can be overridden by command line parameters such as --port or --appname)
    Make sure you change these when starting a new project

  */

  // Port: This is the port the server should run on
  var port = grunt.option('port') || 9000;

  // App Name: This is the ng-app name in client/index.html and Angular files.
  var appName = grunt.option('appname') || 'MyApp';

  // Heroku App Name: This is the name of your app on Heroku
  var herokuAppName = grunt.option('herokuAppName') || 'mean-template';








  // --- You shouldn't need to change anything below this point ---

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // environment
    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    // express: To launch the Express server
    express: {
      options: {
        port: process.env.PORT || port
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


    // clean: Cleans out the distribution and temp folders
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



    // concurrent: Speed up build process by running tasks in parallel
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



    // node-inspector: Debugging
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },


    // nodemon: run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: 'server/app.js',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || port
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:' + port + '/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },


    // rev: Renames files for browser caching purposes
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


    // open: Opens the app in your default browser
    open: {
      server: {
        url: 'http://localhost:' + port
      }
    },


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


    // ngtemplates: Package all the html partials into a single javascript payload
    ngtemplates: {
      options: {
        module: appName,
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



    // useminPrepare: Setup usemin for minification tasks
    useminPrepare: {
      html: ['client/index.html'],
      options: {
        dest: 'dist/public'
      }
    },

    // usemin: Performs rewrites based on rev and the useminPrepare configuration
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

    // imagemin: Compress PNG, GIF, and JPEGs and place them in the dist folder
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

    // svgmin: Compress SVG files and place them in the dist folder
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


    // copy: Copies remaining files to places other tasks can use
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


    // cdnify: Swap out local references of scripts available on Google CDN
    cdnify: {
      dist: {
        html: ['dist/public/*.html']
      }
    },


    // watch: Watches files for changes
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


    // karma: Load in the karma conf file
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },


    // mochaTest: Set up Mocha for testing scripts
    mochaTest: {
      options: {
        reporter: 'list'
      },
      src: ['server/**/*.test.js']
    },


    // jshint: Make sure yur code doesn't suck
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


    // sass: Compiles all client-side SASS files to a single CSS
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


    // autoprefixer: Add vendor prefixed styles to the CSS
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


    // wiredep: Automatically inject Bower components into index.html
    wiredep: {
      target: {
        src: 'client/index.html',
        ignorePath: 'client/',
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, /bootstrap.css/, /font-awesome.css/ ]
      }
    },


    // injector: Inject JS and SCSS file references when files are changed
    injector: {
      options: {

      },

      // scripts: Inject application script files into index.html
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
              '!{.tmp,client}/{app,components}/**/*.test.js'
            ]
          ]
        }
      },

      // sass: Inject component scss into app.scss
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

      // css: Inject component css into index.html
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


    // buildcontrol: Handles the upload of the dist folder contents to Heroku (or any other GIT based hosting provider)
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
          remote: 'git@heroku.com:' + herokuAppName + '.git',
          branch: 'master'
        }
      }
    }

  });





  // --- Tasks

  // wait: Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function() {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function() {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });


  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });


  // serve: Run injectors and compilers
  grunt.registerTask('serve', function(target) {

    // serve the dist folder
    if (target === 'dist') {
      return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
    }

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


  // test: Run tests on the server and client
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


  // build: Compress, optimize, uglify, and copy all of the files into the dist folder
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
