var app = angular.module('trand', ['ngRoute', 'infinite-scroll']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'home/greeting.html',
      controller: 'homeController',
      controllerAs: 'home',
    })
    // .when('/results', {
    //   templateUrl: 'search/results.html',
    //   controller: 'searchController',
    //   controllerAs: 'search',
    //   resolve: {
    //     delay: function($q, $timeout) {
    //       var delay = $q.defer();
    //       $timeout(delay.resolve, 2000);
    //       return delay.promise;
    //     }
    //   }
    // });
}]);
