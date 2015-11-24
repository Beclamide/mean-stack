'use strict';


var _ = require('lodash');

// If we were connecting to local data source we'd require the model file
// But I'm just going to create a catalogue manually below for this demo

var customers = [{
  customerID: 0,
  location: 'LONDON'
},
{
  customerID: 1,
  location: 'LIVERPOOL'
}];



exports.findById = function (req, res) {

  if (!req.params.customerID) {
    // The router should respond with a 404 before this is triggered, but just in case...
    return res.send(400); // Bad Request
  }

  // find the customer
  var customer = _.find(customers, function (element) {
    return element.customerID === parseInt(req.params.customerID);
  });


  if (customer) {

    // We've found a customer!
    return res.status(200).json(customer);

  } else {

    // No customer matched the ID
    return res.status(204).json([]); // No Content

  }


};
