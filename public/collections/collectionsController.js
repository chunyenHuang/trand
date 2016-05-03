var app = angular.module('trand');
app.controller('collectionsController', collections);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService'];

function collections($http, $scope, $location, userService, $sce, $rootScope, collectionsService) {
  var vm = this;
  $scope._ = _;
  vm.getCollections = function (sort) {
    var collections = collectionsService.getCollections(sort);
    collections.then(function (res) {
      vm.list = res.data;
    })
  }
  vm.getItem = function (itemId) {
    var item = collectionsService.getItem(itemId);
    item.then(function (res) {
      $('#item-modal').modal('show');
      vm.item = res.data;
      vm.coverImgUrl = res.data.image.sizes.Best.url;
    })
  }
  vm.removeFromCollections = function (item) {
    var removeItem = collectionsService.remove(item, $rootScope);
  }
  function activate() {
    vm.getCollections('date');
  }
  activate();
}
