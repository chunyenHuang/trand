var app = angular.module('trand');
app.controller('combinationsController', combinations);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService', '$timeout'];

function combinations($http, $scope, $location, userService, $sce, $rootScope, collectionsService, $timeout) {
  var vm = this;
  $scope._ = _;

  // 'use strict';

  $scope.posX = 0;
  $scope.posY = 0;

  $scope.moveX = function (pixels) {
    $scope.posX = $scope.posX + pixels;
  };
  $scope.moveY = function (pixels) {
    $scope.posY = $scope.posY + pixels;
  };
  $scope.$evalAsync(function () {
    $scope.$broadcast('content.changed', 1000);
  });

  $scope.center = function () {
    $scope.posX = 600;
    $scope.posY = 410;
  };

  $scope.last = function (array, index, location) {
    if (index === 0 ) {
      var target = array.length - 1;
    } else {
      var target = index - 1;
    }
    if (location === 'fullbody') {
      $rootScope.query.fullbody = target;
    }
    if (location === 'head') {
      $rootScope.query.head = target;
    }
    if (location === 'eye') {
      $rootScope.query.eye = target;
    }
    if (location === 'top') {
      $rootScope.query.top = target;
    }
    if (location === 'bot') {
      $rootScope.query.bot = target;
    }
    if (location === 'foot') {
      $rootScope.query.foot = target;
    }
    if (location === 'bags') {
      $rootScope.query.bags = target;
    }
  }
  $scope.next = function (array, index, location) {
    if ((index + 1) === array.length) {
      var target = 0;
    } else {
      var target = index + 1;
    }
    if (location === 'fullbody') {
      $rootScope.query.fullbody = target;
    }
    if (location === 'head') {
      $rootScope.query.head = target;
    }
    if (location === 'eye') {
      $rootScope.query.eye = target;
    }
    if (location === 'top') {
      $rootScope.query.top = target;
    }
    if (location === 'bot') {
      $rootScope.query.bot = target;
    }
    if (location === 'foot') {
      $rootScope.query.foot = target;
    }
    if (location === 'bags') {
      $rootScope.query.bags = target;
    }
  }

  vm.newComb = function () {
    var json ={
      combinations: {
        fullbody: vm.fullbody[$rootScope.query.fullbody].item
      }
    }
    var newComb = $http.post('/combinations/new', json);
    newComb.then(function (response) {
      getCombinations();
    })
  }
  vm.getCollectionsOf = function (sort) {
    var collections = collectionsService.getCollections(sort);
    collections.then(function (res) {
      var added = _.where($rootScope.queryLists, {name: sort});
      if (added.length == 0) {
        $rootScope.queryLists.push({
          name: sort,
          data: res.data,
        })
      }
      var edited = _.where($rootScope.query, {name: sort});
      if (edited.length==0){
        $rootScope.query.push({
          name: sort,
          index: 0,
        })
      }
    })
  }

  vm.savePic = function () {
    html2canvas($("#comb-canvas"), {
      allowTaint: true,
      logging:true,
      onrendered: function(canvas) {
        // document.body.appendChild(canvas);
        // $("#img-out").append(canvas);
        canvas.toBlob(function(blob) {
            saveAs(blob, "comb-canvas.png");
        });
      }
    });
  }

  function getCombinations() {
    var getComb = $http.get('/combinations');
    getComb.then(function (res) {
      vm.combs = res.data;
    })
  }

  vm.maker = function () {
    $scope.maker = true;
    $scope.ready = false;
    getCombinations();

    var bodyParts = ['top', 'bot', 'foot', 'fullbody',
                 'head', 'eye', 'neck', 'bags'];
    for (var i = 0; i < bodyParts.length; i++) {
      vm.getCollectionsOf(bodyParts[i]);
    }
    $scope.posX = 0;
    $scope.posY = 0;

    $scope.$broadcast('content.changed');
    $scope.$broadcast('content.reload');

    $timeout(function(){
      $( ".combox-top-draggable" ).draggable({ containment: "#combox-wrapper", scroll: false });
      $( ".combox-bot-draggable" ).draggable({ containment: "#combox-wrapper", scroll: false });
      $( ".combox-fullbody-draggable" ).draggable({ containment: "#combox-wrapper", scroll: false });
      $( ".combox-foot-draggable" ).draggable({ containment: "#combox-wrapper", scroll: false });
      $( ".combox-eye-draggable" ).draggable({ containment: "#combox-wrapper", scroll: false });
      $( ".combox-head-draggable" ).draggable({ containment: "#combox-wrapper", scroll: false });
      $( ".combox-neck-draggable" ).draggable({ containment: "#combox-wrapper", scroll: false });
      $( ".combox-bags-draggable" ).draggable({ containment: "#combox-wrapper", scroll: false });
      $scope.ready = true;
      $( ".combox-top-img" ).resizable();
    }, 2500);
  }
  function activate() {

  }
  activate();
}

app.directive('maker', function () {
  return {
    templateUrl: 'combinations/maker.html'
  }
})
app.directive('thumbs', function () {
  return {
    templateUrl: 'combinations/thumbs.html'
  }
})
