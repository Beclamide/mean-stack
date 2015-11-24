'use strict';

// Require
var express = require('express');
var controller = require('./CustomerLocationService.controller');

// Create a new Express Router
var router = express.Router();

// Set the routes
router.get('/:customerID', controller.findById);


module.exports = router;
