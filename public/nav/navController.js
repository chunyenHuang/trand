var app = angular.module('trand');
app.controller('navController', nav);
app.$inject = ['$scope', '$location'];
function nav($scope, $location) {
  var vm = this;
  $scope.isActive = function (location) {
    console.log($location.path());
    return location === $location.path();
  };
}

app.directive('trand', function () {
  return {
    templateUrl: 'nav/navbar.html'
  }
})
