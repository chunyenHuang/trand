var app = angular.module('trand');
app.controller('searchController', search);
app.$inject = ['$http', '$scope', '$location'];
function search($http, $scope, $location) {
  var vm = this;
  var found = 0;
  vm.results =[];
  vm.search = function () {
    vm.results =[];
    var offset = found;
    var limit = 18;
    var search = $http.get(
      '/search?fts=' + $scope.content + '&cat=' + $scope.category +'&offset=' + offset + '&limit=' + limit
    );
    search.then(function (res) {
      for (var i = 0; i < res.data.length; i++) {
        vm.results.push(res.data[i]);
      }
      found = found + parseInt(res.data.length);
      // $location.path('/results');
    })
  }
  vm.nextPage = function () {
    var limit = 18;
    var search = $http.get(
      '/search?fts=' + $scope.content + '&offset=' + found + '&limit=' + limit
    );
    search.then(function (res) {
      for (var i = 0; i < res.data.length; i++) {
        vm.results.push(res.data[i]);
      }
      found = found + res.data.length;
      $location.path('/results');
    })
  }
  vm.productDetail = function (itemId) {
    $('#'+itemId).modal('show');
  }
  function getCategory() {
    var categories =$http.get('/api-category');
    categories.then(function (res) {
      console.log(res.data);
      vm.categories = res.data;
    })
  }
  function activate() {
    getCategory();
  }
  activate();
}
