'use strict';


// Check the environment system variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


// Require Express
var express = require('express');

// Require the environment configuration file
var config = require('./config/environment');

// Create the Express server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start Server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});


exports = module.exports = app;
