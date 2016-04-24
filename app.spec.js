var chai = require('chai');
var assert = chai.assert;
var request = require('request');
var url ='http://localhost:' + 3000;

describe('Test on Trand:', function () {
  describe('website', function () {
    it('GET: /', function (done) {
      request(url, function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
  })
  describe('User Routes', function () {
    it('POST: /register', function (done) {
      request({
        method: 'post',
        url: url + '/register',
        json:{
          firstName: 'firstname',
          lastName: 'lastname',
          email: '1234567@gmail.com',
          password: '12345678',
          registerDate: new Date(),
        }
      }, function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('DELETE: /resign', function (done) {
      request({
        method: 'delete',
        url: url + '/resign/' + '1234567@gmail.com',
      }, function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
  })

  describe('APIs', function () {
    it('GET: /api/search?fts=dress&offset=0&limit=2', function (done) {
      request(url + '/api/search?fts=dress&offset=0&limit=2', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /api/brand', function(done) {
      request(url+'/api/brand', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /api/category', function(done) {
      request(url+'/api/category', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /api/query', function(done) {
      request(url+'/api/query', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /api/query2', function(done) {
      request(url+'/api/query2', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /api/histogram', function(done) {
      request(url+'/api/histogram', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /api/retailers', function(done) {
      request(url+'/api/retailers', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
  })
  
})
