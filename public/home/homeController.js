var app = angular.module('trand');
app.controller('homeController', home);
app.$inject = ['$http', 'listService', 'collectionsService', '$location', '$anchorScroll'];
function home($http, listService, collectionsService, $rootScope, $location, $anchorScroll) {
  var vm = this;
  var today = new Date();
  vm.timeNow = today.getTime();

  vm.scrollTo = function (id) {
    $location.hash(id);
    $anchorScroll();
  }
  vm.showRetailers = function () {
    var retailers = listService.getRetailers();
    retailers.then(function (res) {
      vm.showed=true;
      vm.retailers = res.data;
    })
  }
  vm.linkto = function () {
    $location.path('/ideas');
  }
  function getRecentCombs () {
    var combs = $http.get('/ideas/recent');
    combs.then(function (response) {
      vm.combs = response.data;
    })
  }
  function activate() {
    $rootScope.loadedCollections = [];
    $rootScope.recentCollections = [];
    var collections = $http.get('/collections?sort=date');
    collections.then(function (res) {
      if (res.data.length > 0) {
        for (var i = 0; i < res.data.length; i++) {
          $rootScope.loadedCollections.push(res.data[i].item);
        }
        var reversed = res.data.reverse();
        if ($rootScope.recentCollections.length == 0) {
          for (var i = 1; i <= 15; i++) {
            $rootScope.recentCollections.push(reversed[i].item);
          }
        }
      }
    })
    getRecentCombs();
  }
  activate();
}
