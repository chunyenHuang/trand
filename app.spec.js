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
    it('POST: /user/register', function (done) {
      request({
        method: 'post',
        url: url + '/user/register',
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
    it('POST: /user/login', function (done) {
      request({
        method: 'post',
        url: url + '/user/login',
        json: {
          email: '1234567@gmail.com',
          password: '12345678',
        }
      }, function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('GET: /user/logout/:email', function (done) {
      request(url + '/user/logout/1234567@gmail.com', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('DELETE: /user/resign/:email', function (done) {
      request({
        method: 'delete',
        url: url + '/user/resign/' + '1234567@gmail.com',
      }, function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
  })

  describe('Collections', function () {
    it('GET: /collections/item', function (done) {
      request(url + '/collections/item/506845070', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
  })

  describe('Combinations', function () {
    it('GET: /combinations', function (done) {
      request(url + '/combinations', function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('POST: /combinations/new', function (done) {
      request({
        method: 'post',
        url: url + '/combinations/new',
        json: {
          information: [],
          combinations: [
            {
              show: false,
              item: {
                price: 0,
              }
            },
          ],
        }
      }, function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
    it('DELETE: /combinations/remove-null', function (done) {
      request({
        method: 'delete',
        url: url + '/combinations/remove-null'
      }, function (err, res, body) {
        assert.equal(res.statusCode, 200);
        done();
      })
    })
  })

  describe('API', function () {
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

  describe('AWS', function () {
    it('POST: /aws/sign_s3', function(done) {
      request({
        method: 'post',
        url: url+'/aws/sign_s3',
        json: {
          file_name: 'test',
          file_type: 'test/test',
          dir_name: 'test'
        }
      }, function (err, res, body) {
      assert.equal(res.statusCode, 200);
      done();
      })
    })
  })

})
