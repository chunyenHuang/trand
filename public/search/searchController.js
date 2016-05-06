var app = angular.module('trand');
app.controller('searchController', search);
app.$inject = ['$http', '$scope', '$location', 'listService', '$sce', 'collectionsService'];
function search($http, $scope, $location, listService, $sce, collectionsService, $rootScope) {
  var vm = this;
  $scope._ = _;
  vm.found = 0;
  vm.results =[];
  vm.busy = false;
  $scope._ = _;

  vm.search = function (option) {
    vm.found = 0;
    vm.results =[];
    var offset = vm.found;
    var limit = 18;
    if (option) {
      if ($scope.content) {
        var content = $scope.content;
      } else {
        var content = option;
      }
    } else {
      var content = $scope.content;
    }
    var search = $http.get(
      '/api/search?fts=' + content + '&cat=' + $scope.cat +'&offset=' + offset + '&limit=' + limit
    );
    search.then(function (res) {
      vm.found = vm.found + res.data.length;
      for (var i = 0; i < res.data.length; i++) {
        vm.results.push(res.data[i]);
      }
      vm.searched = true;
      return searchObject = {
        content: content,
        cat: $scope.cat,
      }
    })
  }
  vm.nextPage = function () {
    if (this.busy) return;
    this.busy = true;
    var limit = 12;
    var search = $http.get(
      '/api/search?fts=' + searchObject.content + '&cat=' + searchObject.cat + '&offset=' + vm.found + '&limit=' + limit
    );
    search.then(function (res) {
      vm.found = vm.found + res.data.length;
      for (var i = 0; i < res.data.length; i++) {
        vm.results.push(res.data[i]);
      }
      vm.busy=false
    })
  }
  vm.productDetail = function (itemId) {
    var detail = collectionsService.productDetail(itemId);
  }
  vm.addToCollections = function (item) {
    var add = collectionsService.update(item, $rootScope);
  }
  vm.removeFromCollections = function (item) {
    var removeItem = collectionsService.remove(item, $rootScope);
  }
  vm.digCategory1 = function (id) {
    var dig = $http.get('/api/category/'+ id);
    dig.then(function (res) {
      vm.catSub1 = res.data;
    })
  }
  vm.digCategory2 = function (id) {
    var dig = $http.get('/api/category/'+ id);
    dig.then(function (res) {
      vm.catSub2 = res.data;
    })
  }
  vm.getItem = function(id) {
    var item = collectionsService.getItem(id);
    item.then(function(res) {
      $('#item-modal').modal('show');
      vm.item = res.data;
      vm.coverImgUrl = res.data.image.sizes.Best.url;
    })
  }
  function getCategory() {
    var categories =$http.get('/api/category');
    categories.then(function (res) {
      vm.categories = res.data;
    })
  }

  function activate() {
    getCategory();
  }
  activate();
}
