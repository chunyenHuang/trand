var chai = require('chai');
var assert = chai.assert;
var request = require('request');
var app = require('./app.js');

var RANDOMIZE = 0;
var server = app.listen(RANDOMIZE);
var port = server.address().port;
var url ='http://localhost:' + port;

describe('Test on Trand:', function () {
  describe('website', function () {
    it('GET: /', function (done) {
      request(url, function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
  })
  describe('Basic Routes', function () {
    it('GET: /search?fts=dress&offset=0&limit=2', function (done) {
      request(url + '/search?fts=dress&offset=0&limit=2', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
  })

  describe('APIs', function () {
    it('GET: /api-brand', function(done) {
      request(url+'/api-brand', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /api-category', function(done) {
      request(url+'/api-category', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /api-query', function(done) {
      request(url+'/api-query', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /api-query2', function(done) {
      request(url+'/api-query2', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /api-histogram', function(done) {
      request(url+'/api-histogram', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /retailers', function(done) {
      request(url+'/retailers', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
  })

  after(function () {
    server.close();
  })
})
