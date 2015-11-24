'use strict';

var expect = require('chai').expect;
var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/MyDemoEndpoint', function() {

  it('should respond with an array', function(done) {
    request(app).get('/api/MyDemoEndpoint')
      .end(function assert(err, res) {
        expect(err).to.not.be.ok;
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.instanceOf(Array);
        done();
      });
  });


});
