'use strict';

var DemoModel = require('./MyDemoEndpoint.model');


exports.index = function (req, res) {

    return res.status(200).json(DemoModel);


};
