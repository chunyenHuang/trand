var app = angular.module('trand');
app.controller('ideasController', ideas);
app.$inject = ['$http', '$scope', '$location'];
function ideas($http, $scope, $location) {
  var vm = this;

  $scope.show = function (item) {
    $('#show-ideas').modal('show');
    vm.detail = item;
    console.log(vm.detail);
  }

  function getAllCombs() {
    var combs = $http.get('/ideas');
    combs.then(function (response) {
      console.log(response.data);
      vm.combs = response.data;
    })
  }
  function activate() {
    getAllCombs();
  }
  activate();
}

app.directive('minishow', function () {
  return {
    templateUrl: 'ideas/minishow.html'
  }
})
