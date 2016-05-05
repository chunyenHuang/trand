var app = angular.module('trand');
app.controller('homeController', home);
app.$inject = ['$http', 'listService', 'collectionsService'];
function home($http, listService, collectionsService, $rootScope) {
  var vm = this;
  vm.showRetailers = function () {
    var retailers = listService.getRetailers();
    retailers.then(function (res) {
      vm.showed=true;
      vm.retailers = res.data;
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
        for (var i = 1; i <= 15; i++) {
          $rootScope.recentCollections.push(reversed[i].item);
        }
      }
    })
  }
  activate();
}
