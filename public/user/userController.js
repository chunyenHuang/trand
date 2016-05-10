var app = angular.module('trand');
app.controller('userController', user);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService', 'awsService'];
function user($http, $scope, $location, userService, $sce, $rootScope, collectionsService, awsService) {
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
      $location.path('/home');
      $rootScope.logged=false;
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
      $rootScope.logged=false;
      $rootScope.loadedCollections = [];
      $rootScope.recentCollections = [];
      $rootScope.currentCombination = {};
      $rootScope.queryLists = [];

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
          if ($rootScope.recentCollections.length == 0) {
            for (var i = 1; i <= 15; i++) {
              $rootScope.recentCollections.push(reversed[i].item);
            }
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
  vm.uploadImg = function (user) {
    var files = document.getElementById("file_input").files;
    var file = files[0];
    if (file == null){
        alert("No file selected.");
    }
    else{
      var file_subname = file.name.split('.');
      file_subname = file_subname.reverse();
      file_subname = file_subname[0];
      var json = {
        file_name: vm.currentUser._id + '.' + file_subname,
        file_type: file.type,
        dir_name: 'users',
      }
      var getSignEdRequest = awsService.signIn(json);
      getSignEdRequest.then(function(res) {
        var img = {
          url: res.data.url,
        }
        var newImg = $http.put('/user/img', img);
        var upload = awsService.upload(file, res.data.signed_request, file.type);
        upload.then(function () {
          $scope.newImg = false;
          getUser();
        })
      })
    }
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
