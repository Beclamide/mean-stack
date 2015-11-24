'use strict';

var path = require('path');
var _ = require('lodash');



var all = {

  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000

}


// Merge the default parameters above with the environment specific ones
module.exports = _.merge(all, require('./' + process.env.NODE_ENV + '.js') || {});
