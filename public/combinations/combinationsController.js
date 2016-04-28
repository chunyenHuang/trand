var app = angular.module('trand');
app.controller('combinationsController', combinations);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService'];

function combinations($http, $scope, $location, userService, $sce, $rootScope, collectionsService) {
  var vm = this;
  $scope._ = _;
  vm.addNewCombination = function () {
    var addNew = $http.get('/combinations/add');
    addNew.then(function (response) {
      console.log(response);
    })
  }
  function getCombinations() {
    var getComb = $http.get('/combinations');
    getComb.then(function (res) {
      vm.combs = res.data;
    })
  }
  function activate() {
    getCombinations();
  }
  activate();
}
