var app = angular.module('trand');
app.controller('ideasController', ideas);
app.$inject = ['$http', '$scope', '$location', '$routeParams'];
function ideas($http, $scope, $location, $routeParams) {
  var vm = this;
  var today = new Date();
  vm.timeNow = today.getTime();

  $scope.show = function (item) {
    $('#show-ideas').modal('show');
    vm.detail = item;
    vm.directlink = $location.absUrl() + '/' + item._id;
    vm.detail.largeUrl = vm.detail.largeUrl + "?" + vm.timeNow;
  }

  vm.display = function () {
    var detail = $http.get('/ideas/detail/' + $routeParams.id);
    detail.then(function (res) {
      vm.detail = res.data;
      vm.detail.largeUrl = vm.detail.largeUrl + "?" + vm.timeNow;
    })
  }

  vm.getAllCombs = function () {
    var combs = $http.get('/ideas');
    combs.then(function (response) {
      vm.combs = response.data;
    })
  }
}

app.directive('minishow', function () {
  return {
    templateUrl: 'ideas/minishow.html'
  }
})
