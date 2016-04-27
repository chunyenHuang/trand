var app = angular.module('trand');
app.controller('collectionsController', collections);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService'];

function collections($http, $scope, $location, userService, $sce, $rootScope, collectionsService) {
  var vm = this;
  vm.getCollections = function (sort) {
    var collections = collectionsService.getCollections(sort);
    collections.then(function (res) {
      vm.list = res.data;
      console.log(vm.list[0].email);
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
    vm.getCollections('date');
  }
  activate();
}
