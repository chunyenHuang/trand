var app = angular.module('trand');
app.controller('homeController', home);
app.$inject = ['$http', 'listService', 'collectionsService'];
function home($http, listService, collectionsService, $rootScope) {
  var vm = this;
  vm.showRetailers = function () {
    var retailers = listService.getRetailers();
    retailers.then(function (res) {
      vm.showed=true;
      vm.retailers = res.data;
    })
  }
  function activate() {
  }
  activate();
}
