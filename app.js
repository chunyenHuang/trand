var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var request = require('request');

app.use(express.static('./public/'));

app.get('/api-brand', function(req, res) {
  var p1 = new Promise(function(resolve, reject) {
    request('http://api.shopstyle.com/api/v2/brands?pid=uid41-33788821-64&offset=0&limit=1', function (err, res, body) {
      resolve(body);
    })
  });
  p1.then(function (body) {
    var response = JSON.parse(body);
    res.json(response.brands);
  })
})
app.get('/api-category', function(req, res) {
  var p1 = new Promise(function(resolve, reject) {
    request('http://api.shopstyle.com/api/v2/categories?pid=uid41-33788821-64', function (err, res, body) {
      resolve(body);
    })
  });
  p1.then(function (body) {
    var response = JSON.parse(body);
    res.json([response.metadata, response.categories[0]]);
  })
})
app.get('/api-query', function(req, res) {
  var p1 = new Promise(function(resolve, reject) {
    request('http://api.shopstyle.com/api/v2/products?pid=uid41-33788821-64&fts=red+dress&offset=0&limit=2', function (err, res, body) {
      resolve(body);
    })
  });
  p1.then(function (body) {
    var response = JSON.parse(body);
    res.json(response.products);
  })
})
app.get('/api-histogram', function(req, res) {
  var p1 = new Promise(function(resolve, reject) {
    request('http://api.shopstyle.com/api/v2/products/histogram?pid=uid41-33788821-64&filters=Brand&fts=red+dress&offset=0&limit=2', function (err, res, body) {
      resolve(body);
    })
  });
  p1.then(function (body) {
    var response = JSON.parse(body);
    res.json(response);
  })
})

if (!require.main.loaded) {
  app.listen(port, function () {
    console.log('running on port: '+ port);
  })
}

app.on('close', function() {
  console.log('rs');
})

module.exports = app;
