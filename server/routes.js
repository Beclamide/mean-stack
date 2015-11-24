'use strict';


// Require the errors file
var errors = require('./components/errors');

// Require the environment configuration file
var config = require('./config/environment');

module.exports = function(app) {

  // Routes
  app.use('/api/MyDemoEndpoint', require('./api/MyDemoEndpoint'));


  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);


  // All other routes should redirect to index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(app.get('appPath') + '/index.html', config);
    });

}
