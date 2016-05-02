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

  $scope.last = function (name) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    if ((theOne[0].index)===0) {
      theOne[0].index = theOne[0].data.length - 1 ;
    } else {
      theOne[0].index -- ;
    }
  }

  $scope.next = function (name) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    if ((theOne[0].index + 1) === theOne[0].data.length) {
      theOne[0].index = 0;
    } else {
      theOne[0].index ++ ;
    }
  }

  $scope.showInBox = function (name) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    theOne[0].show = !theOne[0].show;
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
  vm.getCollectionsOf = function (sort, index) {
    var collections = collectionsService.getCollections(sort);
    collections.then(function (res) {
      var added = _.where($rootScope.queryLists, {name: sort});
      if (added.length == 0) {
        var object = {
          order: index,
          name: sort,
          data: res.data,
          index: 0,
          show: true,
        }
        if (sort === 'fullbody' || sort === 'neck') {
          object.show = false;
        }
        $rootScope.queryLists.push(object);
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

    var bodyParts = ['top', 'bot', 'fullbody', 'foot',
                 'neck', 'head', 'eye', 'bags'];
    for (var i = 0; i < bodyParts.length; i++) {
      vm.getCollectionsOf(bodyParts[i], i);
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
      console.log($scope.queryLists);

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
