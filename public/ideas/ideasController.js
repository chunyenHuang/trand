var app = angular.module('trand');
app.controller('ideasController', ideas);
app.$inject = ['$scope', '$location'];
function ideas($scope, $location) {
  var vm = this;
}

app.directive('show', function () {
  return {
    templateUrl: 'ideas/combination.html'
  }
})
