'use strict';

// Require
var express = require('express');
var controller = require('./MyDemoEndpoint.controller');

// Create a new Express Router
var router = express.Router();

// Set the routes
router.get('/', controller.index);


module.exports = router;
