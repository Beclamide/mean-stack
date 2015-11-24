'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');

module.exports = function (app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');


  if ('development' === env || 'test' === env) {
    // Create the Express server for the development environment
    app.use(favicon(path.join(config.root, 'client', 'assets/images/favicon.png')));
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(errorHandler());
  }


  if ('production' === env) {
    // Here we do the same as above but without LiveReload etc.
    // also because we build to a 'dist' folder, file locations would be different.
  }


}
