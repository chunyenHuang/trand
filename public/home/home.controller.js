var app = angular.module('trand');
app.controller('homeController', home);
app.$inject = ['$http', 'listService'];
function home($http, listService) {
  var vm = this;
  function showRetailers() {
    var retailers = listService.getRetailers();
    retailers.then(function (res) {
      vm.retailers = res.data;
      console.log(vm.retailers);
    })
  }
  function activate() {
    showRetailers();
  }
  activate();
}
