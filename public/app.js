var app = angular.module('trand', ['ngRoute', 'infinite-scroll', 'ngSanitize', 'xeditable', 'ui.bootstrap', 'ngAnimate', 'ngScrollable']);
app.$inject = ['$http'];
function getLastFifteen(array) {
  array = array.reverse();
  var fifteen = _.first(array, 15);
  array = array.reverse();
  return  fifteen;
}
app.run(function ($rootScope, $http) {
  $rootScope.logged = false;
  $rootScope.loadedCollections = [];
  $rootScope.recentCollections = [];
  var collections = $http.get('/collections?sort=date');
  collections.then(function (res) {
    for (var i = 0; i < res.data.length; i++) {
      $rootScope.loadedCollections.push(res.data[i].item);
    }
    var reversed = res.data.reverse();
    for (var i = 1; i <= 15; i++) {
      $rootScope.recentCollections.push(reversed[i].item);
    }
  })
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
    .when('/combinations', {
      templateUrl: 'combinations/combinations.html',
      controller: 'combinationsController',
      controllerAs: 'combinations',
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
function collectionsService($http, $rootScope) {
  function getCollections(sort) {
    return $http.get('/collections?sort=' + sort);
  }
  function update(item, $rootScope) {
    var addItem = $http.put('/collections/update/' + item.id);
    addItem.then(function () {
      for (var i = 0; i < $rootScope.loadedCollections.length; i++) {
        if ($rootScope.loadedCollections[i].id === item.id) {
          var exist = true;
          break;
        }
      }
      if (!exist) {
        $rootScope.loadedCollections.push(item);
      }
      $rootScope.recentCollections = getLastFifteen($rootScope.loadedCollections);
    })
  }
  function remove(item, $rootScope) {
    var removeItem = $http.put('/collections/remove/' + item.id);
    removeItem.then(function () {
      var matched = _.where($rootScope.loadedCollections, {id: item.id});
      var position = $rootScope.loadedCollections.indexOf(matched[0]);
      $rootScope.loadedCollections.splice(position, 1);
      $rootScope.recentCollections = getLastFifteen($rootScope.loadedCollections);
    })

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
