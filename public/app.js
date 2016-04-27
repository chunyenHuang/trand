var app = angular.module('trand', ['ngRoute', 'infinite-scroll', 'ngSanitize', 'xeditable']);

app.run(function ($rootScope) {
  $rootScope.logged = false;
  $rootScope.loadedCollections = [];
  $rootScope.recentCollections = [];
})

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

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
    })
    .when('/user', {
      templateUrl: 'user/profile.html',
      controller: 'userController',
      controllerAs: 'user',
    })
    .when('/collections', {
      templateUrl: 'collections/collections.html',
      controller: 'collectionsController',
      controllerAs: 'collections',
    })
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
  function getUser() {
    return $http.get('/user');
  }
  function register(json) {
    return $http.post('/user/register', json);
  }
  function login(json) {
    return $http.post('/user/login', json);
  }
  function logout(email) {
    return $http.get('/user/logout/' + email);
  }
  function resign(email) {
    return $http.delete('/user/resign/' + email);
  }
  function update(json) {
    return $http.put('/user/update/', json);
  }

  return {
    getUser: getUser,
    register: register,
    login: login,
    logout: logout,
    resign: resign,
    update: update,
  }
}

app.factory('collectionsService', collectionsService);
collectionsService.$inject=['$http'];
function collectionsService($http) {
  function getCollections() {
    return $http.get('/collections');
  }
  function update(id) {
    return $http.put('/collections/update/' + id);
  }
  function remove(id) {
    return $http.put('/collections/remove/' + id);
  }
  function getItem(id) {
    return $http.get('/collections/item/' + id);
  }

  return {
    getCollections: getCollections,
    update: update,
    remove: remove,
    getItem: getItem,
  }
}
