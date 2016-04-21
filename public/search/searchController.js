var app = angular.module('trand');
app.controller('searchController', search);
app.$inject = ['$http', '$scope', '$location'];
function search($http, $scope, $location) {
  var vm = this;
  vm.search = function () {
    var offset = 0;
    var limit = 18;
    var search = $http.get(
      '/search?fts=' + $scope.content + '&offset=' + offset + '&limit=' + limit
    );
    search.then(function (res) {
      vm.results = res.data;
      console.log(vm.results[0]);
      $location.path('/results');
    })
  }
  vm.productDetail = function (itemId) {
    console.log(itemId);
    $('#'+itemId).modal('show');
  }
}
