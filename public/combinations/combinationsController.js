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

  $scope.last = function (array, location, index) {
    if (index === 0 ) {
      var target = array.length - 1;
    } else {
      var target = index - 1;
    }
    if (location === 'top') {
      vm.queryTop = target;
    }
    if (location === 'bot') {
      vm.queryBot = target;
    }
    if (location === 'fullbody') {
      vm.queryFullbody = target;
    }
  }
  $scope.next = function (array, location, index) {
    if ((index + 1) === array.length) {
      var target = 0;
    } else {
      var target = index + 1;
    }
    if (location === 'top') {
      vm.queryTop = target;
    }
    if (location === 'bot') {
      vm.queryBot = target;
    }
    if (location === 'fullbody') {
      vm.queryFullbody = target;
    }
  }


  vm.newComb = function () {
    var json ={
      combinations: 'test',
    }
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
        console.log(vm.top);
      }
      if (sort === 'bot') {
        vm.bot = res.data;
      }
      if (sort === 'foot') {
        vm.foot = res.data;
      }
      if (sort === 'fullbody') {
        vm.fullbody = res.data;
      }
    })
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
  }
  activate();
}

app.directive('maker', function () {
  return {
    templateUrl: 'combinations/maker.html'
  }
})