var app = angular.module('trand');
app.controller('combinationsController', combinations);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService', '$timeout'];

function combinations($http, $scope, $location, userService, $sce, $rootScope, collectionsService, $timeout) {
  var vm = this;
  $scope._ = _;
  if ($rootScope.currentCombination.title) {
    $scope.author = $rootScope.currentCombination.author;
    $scope.title = $rootScope.currentCombination.title;
    $scope.eventType = $rootScope.currentCombination.eventType;
    $scope.descrition = $rootScope.currentCombination.descrition;
  }
  // 'use strict';

  $scope.posX = 0;
  $scope.posY = 0;

  $scope.moveX = function (pixels) {
    $scope.posX = $scope.posX + pixels;
  };
  $scope.moveY = function (pixels) {
    $scope.posY = $scope.posY + pixels;
  };
  $scope.$evalAsync(function () {
    $scope.$broadcast('content.changed', 1000);
  });

  $scope.center = function () {
    $scope.posX = 600;
    $scope.posY = 410;
  };

  $scope.last = function (name) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    if ((theOne[0].index)===0) {
      theOne[0].index = theOne[0].data.length - 1 ;
    } else {
      theOne[0].index -- ;
    }
    theOne[0].imgUrl = theOne[0].data[theOne[0].index].item.image.sizes.Best.url;
  }

  $scope.next = function (name) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    if ((theOne[0].index + 1) === theOne[0].data.length) {
      theOne[0].index = 0;
    } else {
      theOne[0].index ++ ;
    }
    theOne[0].imgUrl = theOne[0].data[theOne[0].index].item.image.sizes.Best.url;
  }

  $scope.showInBox = function (name) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    theOne[0].show = !theOne[0].show;
  }

  $scope.setPosition = function (name) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    var current = document.getElementById('combox-'+ name + '-draggable');
    theOne[0].position = current.getAttribute('style');
  }

  $scope.select = function (name, index) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    theOne[0].index = index;
    theOne[0].imgUrl = theOne[0].data[theOne[0].index].item.image.sizes.Best.url;
  }

  $scope.save = function () {
    $rootScope.currentCombination.author = $scope.author;
    $rootScope.currentCombination.title = $scope.title;
    $rootScope.currentCombination.eventType = $scope.eventType;
    $rootScope.currentCombination.descrition = $scope.descrition;
  }

  vm.newComb = function () {
    $scope.thumbShow = 'save';
    $scope.saveMsg = 'Saving...';
    var rootArray = $rootScope.queryLists;
    var saveComb = [];
    for (var i = 0; i < rootArray.length; i++) {
      var theOne = rootArray[i].data[rootArray[i].index];
      var object = {
        imgUrl: rootArray[i].imgUrl,
        index: rootArray[i].index,
        name: rootArray[i].name,
        order: rootArray[i].order,
        position: rootArray[i].position,
        show: rootArray[i].show,
        item: {},
      }
      saveComb.push(object);
      saveComb[i].item.id = theOne.item.id;
      saveComb[i].item.clickUrl = theOne.item.clickUrl;
      saveComb[i].item.name = theOne.item.name;
      if (theOne.item.brand) {
        saveComb[i].item.brandName = theOne.item.brand.name;
      }
      saveComb[i].item.price = theOne.item.price;
      saveComb[i].item.retailerName = theOne.item.retailer.name;
      saveComb[i].item.categories = theOne.item.categories;
    }
    var json = {
      information: $rootScope.currentCombination,
      combinations: saveComb,
    }
    var newComb = $http.post('/combinations/new', json);
    newComb.then(function (response) {
      if (response.status == '201') {
        $rootScope.currentCombination._id = response.data;
      }
      // getCombinations();
      $timeout(function () {
        $scope.saveMsg = 'Saved successfully!';
      }, 2000);
    })
  }

  vm.getCollectionsOf = function (sort, index) {
    var collections = collectionsService.getCollections(sort);
    collections.then(function (res) {
      var added = _.where($rootScope.queryLists, {name: sort});
      if (added.length == 0) {
        var object = {
          order: index,
          name: sort,
          data: res.data,
          index: 0,
          show: true,
          imgUrl: res.data[0].item.image.sizes.Best.url,
        }
        if (sort === 'top') {
          object.position = 'left: 280px; top: 40px;';
        }
        if (sort === 'bot') {
          object.position = 'left: 280px; bottom: 40px';
        }
        if (sort === 'fullbody') {
          object.show = false;
          object.position = 'right: 80px; top: 40px;'
        }
        if (sort === 'foot') {
          object.position = 'right: 80px; bottom: 40px;';
        }
        if (sort === 'head') {
          object.show = false;
          object.position = 'left: 40px; top: 40px;';
        }
        if (sort === 'eye') {
          object.position = 'left: 40px; top: 200px;';
        }
        if (sort === 'neck') {
          object.show = false;
          object.position = 'left:40px; top:300px;'
        }
        if (sort === 'bags') {
          object.position = 'left: 40px; bottom: 40px;';
        }
        $rootScope.queryLists.push(object);
      }
    })
  }

  vm.savePic = function () {
    var bodyParts = ['top', 'bot', 'fullbody', 'foot',
                 'neck', 'head', 'eye', 'bags'];

    var canvasTest = document.createElement('canvas');
    canvasTest.setAttribute('id', 'canvasTest');
    var context = canvasTest.getContext('2d');
    canvasTest.width = 700;
    canvasTest.height = 800;
    canvasTest.setAttribute('style', 'border: 1px solid black;');

    var canvasThumb = document.createElement('canvas');
    canvasThumb.setAttribute('id', 'canvasThumb');
    var contextThumb = canvasThumb.getContext('2d');
    canvasThumb.width = canvasTest.width/8;
    canvasThumb.height = canvasTest.height/8;
    canvasThumb.setAttribute('style', 'border: 1px solid black;');

    for (var i = 0; i < bodyParts.length; i++) {
      var pos = $("#combox-" + bodyParts[i] + "-draggable").position();
      var theImg = document.getElementById('combox-' + bodyParts[i] + '-img');
      var width = theImg.clientWidth;
      var height = theImg.clientHeight;

      var posLeftThumb = pos.left/8;
      var posTopThumb = pos.top/8;
      var widthThumb = theImg.clientWidth/8;
      var heightThumb = theImg.clientHeight/8;

      context.drawImage(theImg, pos.left, pos.top, width, height);
      contextThumb.drawImage(theImg, posLeftThumb, posTopThumb, widthThumb, heightThumb);
    }

    $("#img-out").append(canvasThumb);
  }

  function getCombinations() {
    var getComb = $http.get('/combinations');
    getComb.then(function (res) {
      vm.combs = res.data;
    })
  }

  vm.maker = function () {
    $scope.maker = true;
    $scope.ready = false;
    getCombinations();

    var bodyParts = ['top', 'bot', 'fullbody', 'foot',
                 'neck', 'head', 'eye', 'bags'];
    for (var i = 0; i < bodyParts.length; i++) {
      vm.getCollectionsOf(bodyParts[i], i);
    }
    $scope.posX = 0;
    $scope.posY = 0;

    $scope.$broadcast('content.changed');
    $scope.$broadcast('content.reload');

    $timeout(function(){
      var array = ['top', 'bot', 'fullbody', 'foot', 'eye', 'head', 'neck', 'bags'];
      for (var i = 0; i < array.length; i++) {
        $( "#combox-" + array[i] + "-draggable").draggable({containment: "#combox-wrapper", scroll: false });
        $( "#combox-" + array[i] + "-draggable" ).resizable({containment: "#combox-wrapper", autoHide: true});
      }
      $scope.ready = true;
    }, 2000);
  }
  function activate() {
  }
  activate();
}

app.directive('maker', function () {
  return {
    templateUrl: 'combinations/maker.html'
  }
})
app.directive('thumbs', function () {
  return {
    templateUrl: 'combinations/thumbs.html'
  }
})
