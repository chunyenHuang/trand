var app = angular.module('trand', ['ngRoute', 'infinite-scroll']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home/greeting.html',
      controller: 'homeController',
      controllerAs: 'home',
    })
    .when('/home', {
      templateUrl: 'home/greeting.html',
      controller: 'homeController',
      controllerAs: 'home',
    })
    .when('/search', {
      templateUrl: 'search/search.html',
      controller: 'searchController',
      controllerAs: 'search',
    });
}]);

app.factory('listService', listService);
listService.$inject=['$http'];
function listService($http) {
  function getRetailers() {
    return $http.get('/api/retailers');
  }
  return {
    getRetailers: getRetailers,
  }
}
app.factory('userService', userService);
listService.$inject=['$http'];
function userService($http) {
  function register() {
    return $http.get('/register');
  }
  function login() {
    return $http.get('/login');
  }
  function getUser() {
    return $http.get('/user');
  }
  function editUser() {
    return $http.get('/user/edit');
  }

  return {
    getUser: getUser,
    register: register,
    login: login,
    editUser: editUser,
  }
}
