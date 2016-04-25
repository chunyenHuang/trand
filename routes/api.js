var express = require('express');
var router = express.Router();

var request = require('request');
var apiUrl = 'http://api.shopstyle.com/api/v2'
var pid = '?pid=uid41-33788821-64'

router.get('/', function (req, res) {
  res.sendStatus(200);
})

router.get('/brand', function(req, res) {
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
router.get('/category', function(req, res) {
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
    res.json(list.sort());
  })
})
router.get('/query', function(req, res) {
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
router.get('/query2', function(req, res) {
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
router.get('/histogram', function(req, res) {
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

router.get('/retailers', function (req, res) {
  console.log('get Retailers');
  var p1 = new Promise(function(resolve, reject) {
    request(apiUrl + '/retailers' + pid , function (err, res, body) {
      resolve(body);
    })
  });
  p1.then(function (body) {
    var response = JSON.parse(body);
    // var list = [];
    // for (var i = 0; i < 300; i++) {
    //   list.push({
    //     name: response.retailers[i].name,
    //   });
    // }
    res.json(response.retailers);
  })
})

router.get('/search', function (req, res) {
  console.log(req.url);
  var fts = req.query.fts;
  var cat = req.query.cat;
  var offset = req.query.offset;
  var limit = req.query.limit;
  var p1 = new Promise(function(resolve, reject) {
    request(apiUrl + '/products' + pid + '&fts='+ fts + '&offset=' + offset + '&cat=' + cat + '&limit=' + limit , function (err, res, body) {
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

module.exports = router;
