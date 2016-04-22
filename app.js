var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var request = require('request');
var apiUrl = 'http://api.shopstyle.com/api/v2/products?pid=uid41-33788821-64'

app.use(express.static('./public/'));

app.get('/search', function (req, res) {
  console.log(req.url);
  var fts = req.query.fts;
  var cat = req.query.cat;
  var offset = req.query.offset;
  var limit = req.query.limit;
  var p1 = new Promise(function(resolve, reject) {
    request(apiUrl + '&fts='+ fts + '&offset=' + offset + '&cat=' + cat + '&limit=' + limit , function (err, res, body) {
      resolve(body);
      reject(err);
    })
  });
  p1.then(function (body) {
    var response = JSON.parse(body);
    res.json(response.products);
  }, function (err) {
    console.log(err);
    res.sendStatus(404);
  })
})

app.get('/api-brand', function(req, res) {
  var p1 = new Promise(function(resolve, reject) {
    request('http://api.shopstyle.com/api/v2/brands?pid=uid41-33788821-64', function (err, res, body) {
      resolve(body);
    })
  });
  p1.then(function (body) {
    var response = JSON.parse(body);
    var allBrandsName =[];
    for (var i = 0; i < response.brands.length; i++) {
      allBrandsName.push(response.brands[i].name);
    }
    res.json(allBrandsName.sort());
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
    var list = [];
    for (var i = 0; i < response.categories.length; i++) {
      list.push({
        name: response.categories[i].name,
        id: response.categories[i].id,
      });
    }
    console.log(list.sort());
    res.json(list.sort());
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
app.get('/api-query2', function(req, res) {
  var p1 = new Promise(function(resolve, reject) {
    request('http://api.shopstyle.com/api/v2/products?pid=uid41-33788821-64&cat=womens-clothes&fts=dress&offset=0&limit=10', function (err, res, body) {
      resolve(body);
    })
  });
  p1.then(function (body) {
    var response = JSON.parse(body);
    var products =[];
    for (var i = 0; i < response.products.length; i++) {
      var product = {
        name: response.products[i].brandedName
      }
      products.push(product);
    }
    res.json(products);
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
