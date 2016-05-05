var app = angular.module('trand');
app.controller('ideasController', ideas);
app.$inject = ['$http', '$scope', '$location', '$routeParams'];
function ideas($http, $scope, $location, $routeParams) {
  var vm = this;

  $scope.show = function (item) {
    $('#show-ideas').modal('show');
    vm.detail = item;
    vm.directlink = $location.absUrl() + '/' + item._id;
  }

  vm.display = function () {
    console.log($routeParams);
    var detail = $http.get('/ideas/detail/' + $routeParams.id);
    detail.then(function (res) {
      vm.detail = res.data;
    })
  }

  vm.getAllCombs = function () {
    var combs = $http.get('/ideas');
    combs.then(function (response) {
      console.log(response.data);
      vm.combs = response.data;
    })
  }
}

app.directive('minishow', function () {
  return {
    templateUrl: 'ideas/minishow.html'
  }
})
