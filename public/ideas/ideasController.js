var app = angular.module('trand');
app.controller('ideasController', ideas);
app.$inject = ['$http', '$scope', '$location'];
function ideas($http, $scope, $location) {
  var vm = this;
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
