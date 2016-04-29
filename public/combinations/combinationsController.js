var app = angular.module('trand');
app.controller('combinationsController', combinations);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService'];

function combinations($http, $scope, $location, userService, $sce, $rootScope, collectionsService) {
  var vm = this;
  $scope._ = _;

  'use strict';

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

  $scope.last = function (array, index, location) {
    if (index === 0 ) {
      var target = array.length - 1;
    } else {
      var target = index - 1;
    }
    if (location === 'fullbody') {
      $rootScope.query.fullbody = target;
    }
    if (location === 'head') {
      $rootScope.query.head = target;
    }
    if (location === 'eye') {
      $rootScope.query.eye = target;
    }
    if (location === 'top') {
      $rootScope.query.top = target;
    }
    if (location === 'bot') {
      $rootScope.query.bot = target;
    }
    if (location === 'foot') {
      $rootScope.query.foot = target;
    }
    if (location === 'bags') {
      $rootScope.query.bags = target;
    }
  }
  $scope.next = function (array, index, location) {
    if ((index + 1) === array.length) {
      var target = 0;
    } else {
      var target = index + 1;
    }
    if (location === 'fullbody') {
      $rootScope.query.fullbody = target;
    }
    if (location === 'head') {
      $rootScope.query.head = target;
    }
    if (location === 'eye') {
      $rootScope.query.eye = target;
    }
    if (location === 'top') {
      $rootScope.query.top = target;
    }
    if (location === 'bot') {
      $rootScope.query.bot = target;
    }
    if (location === 'foot') {
      $rootScope.query.foot = target;
    }
    if (location === 'bags') {
      $rootScope.query.bags = target;
    }
  }

  vm.newComb = function () {
    var json ={
      combinations: {
        fullbody: vm.fullbody[$rootScope.query.fullbody].item
      }
    }
    console.log(json);
    var newComb = $http.post('/combinations/new', json);
    newComb.then(function (response) {
      getCombinations();
    })
  }
  vm.getCollectionsOf = function (sort) {
    var collections = collectionsService.getCollections(sort);
    collections.then(function (res) {
      if (sort === 'top') {
        vm.top = res.data;
        if (!$rootScope.query.top) {
          $rootScope.query.top=0;
        }
      }
      if (sort === 'bot') {
        vm.bot = res.data;
        if (!$rootScope.query.bot) {
          $rootScope.query.bot=0;
        }
      }
      if (sort === 'foot') {
        vm.foot = res.data;
        if (!$rootScope.query.foot) {
          $rootScope.query.foot=0;
        }
      }
      if (sort === 'fullbody') {
        vm.fullbody = res.data;
        if (!$rootScope.query.fullbody) {
          $rootScope.query.fullbody=0;
        }
      }
      if (sort === 'head') {
        vm.head = res.data;
        if (!$rootScope.query.head) {
          $rootScope.query.head=0;
        }
      }
      if (sort === 'eye') {
        vm.eye = res.data;
        if (!$rootScope.query.eye) {
          $rootScope.query.eye=0;
        }
      }
      if (sort === 'bags') {
        vm.bags = res.data;
        if (!$rootScope.query.bags) {
          $rootScope.query.bags=0;
        }
      }
    })
  }

  vm.savePic = function () {
    html2canvas($("#comb-canvas"), {
      allowTaint: true,
      logging:true,
      onrendered: function(canvas) {
        // document.body.appendChild(canvas);
        // $("#img-out").append(canvas);
        canvas.toBlob(function(blob) {
            saveAs(blob, "comb-canvas.png");
        });
      }
    });
  }

  function getCombinations() {
    var getComb = $http.get('/combinations');
    getComb.then(function (res) {
      vm.combs = res.data;
    })
  }
  function activate() {
    getCombinations();
    vm.getCollectionsOf('top');
    vm.getCollectionsOf('bot');
    vm.getCollectionsOf('foot');
    vm.getCollectionsOf('fullbody');
    vm.getCollectionsOf('head');
    vm.getCollectionsOf('eye');
    vm.getCollectionsOf('neck');
    vm.getCollectionsOf('bags');
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
