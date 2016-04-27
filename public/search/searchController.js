var app = angular.module('trand');
app.controller('searchController', search);
app.$inject = ['$http', '$scope', '$location', 'listService', '$sce', 'collectionsService'];
function search($http, $scope, $location, listService, $sce, collectionsService, $rootScope) {
  var vm = this;
  var found = 0;
  vm.results =[];
  vm.busy = false;
  vm.search = function (option) {
    found = 0;
    vm.results =[];
    var offset = found;
    var limit = 36;
    if (option) {
      if ($scope.content) {
        var content = $scope.content;
      } else {
        var content = option;
      }
    } else {
      var content = $scope.content;
    }
    console.log(content);
    console.log($scope.cat);
    var search = $http.get(
      '/api/search?fts=' + content + '&cat=' + $scope.cat +'&offset=' + offset + '&limit=' + limit
    );
    search.then(function (res) {
      for (var i = 0; i < res.data.length; i++) {
        vm.results.push(res.data[i]);
      }
      found = found + parseInt(res.data.length);
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
      '/api/search?fts=' + searchObject.content + '&cat=' + searchObject.cat + '&offset=' + found + '&limit=' + limit
    );
    search.then(function (res) {
      found = found + res.data.length;
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
    var addItem = collectionsService.update(item.id);
    addItem.then(function () {
      vm.added = true;
      for (var i = 0; i < $rootScope.loadedCollections.length; i++) {
        if ($rootScope.loadedCollections[i] === item.id) {
          var exist = true;
          break;
        }
      }
      if (!exist) {
        $rootScope.loadedCollections.push(item.id);
      }
      for (var i = 0; i < $rootScope.recentCollections.length; i++) {
        if ($rootScope.recentCollections[i] === item.id) {
          var exist = true;
          break;
        }
      }
      if (!exist) {
        $rootScope.recentCollections.push({id:item.id, thumb:item.image.sizes.Small.url});
      }
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

  function getCategory() {
    var categories =$http.get('/api/category');
    categories.then(function (res) {
      vm.categories = res.data;
    })
  }
  function loadCollections() {
    var collections = collectionsService.getCollections();
    collections.then(function (res) {
      for (var i = 0; i < res.data.length; i++) {
        $rootScope.loadedCollections.push(parseInt(res.data[i].itemId));
      }
    })
  }

  function activate() {
    getCategory();
    loadCollections();
  }
  activate();
}
