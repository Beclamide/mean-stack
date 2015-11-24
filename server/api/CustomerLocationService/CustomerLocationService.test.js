'use strict';

var expect = require('chai').expect;
var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/CustomerLocationService/0', function() {

  it('should respond with JSON array', function(done) {
    request(app).get('/api/CustomerLocationService/0')
      .end(function assert(err, res) {
        expect(err).to.not.be.ok;
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.instanceOf(Object);
        done();
      });
  });

  it('should contains the keys \'customerID\', \'location\'', function(done) {
    request(app).get('/api/CustomerLocationService/0')
      .end(function assert(err, res) {
        expect(res.body).to.have.all.keys(['customerID', 'location']);
        done();
      });
  });
});
