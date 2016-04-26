var app = angular.module('trand');
app.directive('searchForm', function () {
  return {
    templateUrl: 'search/form.html'
  }
})
app.directive('results', function () {
  return {
    templateUrl: 'search/results.html'
  }
})
app.directive('ad', function () {
  return {
    templateUrl: 'search/ad.html'
  }
})
