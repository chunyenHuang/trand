var app = angular.module('trand');
app.controller('userController', user);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService'];
function user($http, $scope, $location, userService, $sce, $rootScope, collectionsService) {
  var vm = this;
  $scope.loginEmail = '';
  $scope.loginPassword = '';
  $scope.newFirstName = '';
  $scope.newLastName = '';
  $scope.newEmail = '';
  $scope.newPassword = '';

  vm.register = function () {
    var newUser = {
      firstName: $scope.newFirstName,
      lastName: $scope.newLastName,
      email: $scope.newEmail,
      password: $scope.newPassword,
    }
    var register = userService.register(newUser);
    register.then(function (res) {
      $rootScope.logged = true;
      $location.path('/home');
    })
  }
  vm.logout = function (email) {
    var logout = userService.logout(email);
    logout.then(function (res) {
      $rootScope.logged=false;
      $location.path('/home');

      $rootScope.loadedCollections = [];
      $rootScope.recentCollections = [];
      $rootScope.currentCombination = {};
      $rootScope.queryLists = [];
    })
  }
  vm.login = function () {
    var loginUser = {
      email: $scope.loginEmail,
      password: $scope.loginPassword,
    }
    var login = userService.login(loginUser);
    login.then(function (res) {
      $rootScope.logged = true;
      $location.path('/home');
      $rootScope.loadedCollections = [];
      $rootScope.recentCollections = [];
      var collections = $http.get('/collections?sort=date');
      collections.then(function (res) {
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            $rootScope.loadedCollections.push(res.data[i].item);
          }
          var reversed = res.data.reverse();
          for (var i = 1; i <= 15; i++) {
            $rootScope.recentCollections.push(reversed[i].item);
          }
        }
      })
    })
  }
  vm.update = function () {
    var update = userService.update($scope.user.currentUser);
    update.then(function (res) {
      $location.path('/user');
    })
  }

  function getUser() {
    var currentUser = userService.getUser();
    currentUser.then(function (res) {
      if (res.data.firstName != 'guest') {
        $rootScope.logged = true;
      } else {
        $rootScope.logged = false;
      }
      vm.currentUser = res.data;
    })
  }
  function activate() {
    getUser();
  }
  activate();
}

app.directive('login', function () {
  return {
    templateUrl: 'user/login.html'
  }
})

app.directive('register', function () {
  return {
    templateUrl: 'user/register.html'
  }
})
