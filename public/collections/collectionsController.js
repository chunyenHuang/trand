var app = angular.module('trand');
app.controller('collectionsController', collections);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService'];

function collections($http, $scope, $location, userService, $sce, $rootScope, collectionsService) {
  var vm = this;
  function getCollections() {
    var collections = collectionsService.getCollections();
    collections.then(function (res) {
      console.log(res.data);
      vm.list = [];
      for (var i = 0; i < res.data.length; i++) {
        var date = res.data[i].date
        var item = collectionsService.getItem(res.data[i].itemId);
        item.then(function (res) {
          vm.list.push({date: date, item: res.data});
        })
      }
    })
  }
  vm.productDetail = function (itemId) {
    var detail = collectionsService.productDetail(itemId);
  }
  vm.removeFromCollections = function (item) {
    var removeItem = collectionsService.remove(item.id);
    removeItem.then(function () {
      vm.added = false;
      var position = $rootScope.loadedCollections.indexOf(item.id);
      $rootScope.loadedCollections.splice(position, 1);

      var matched = _.where($rootScope.recentCollections, {id: item.id});
      $rootScope.recentCollections = _.without($rootScope.recentCollections, matched[0]);
    })
  }
  function activate() {
    getCollections();
  }
  activate();
}
