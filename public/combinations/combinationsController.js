var app = angular.module('trand');
app.controller('combinationsController', combinations);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService'];

function combinations($http, $scope, $location, userService, $sce, $rootScope, collectionsService) {
  var vm = this;
  $scope._ = _;
  // $scope.dragOptions = {
  //   start: function(e) {
  //     console.log("STARTING");
  //   },
  //   drag: function(e) {
  //     console.log("DRAGGING");
  //   },
  //   stop: function(e) {
  //     console.log("STOPPING");
  //   },
  //   container: 'comb-top-field',
  // }

  $scope.lastTop = function (array) {
    if (vm.queryTop === 0 ) {
      vm.queryTop = array.length - 1;
    } else {
      vm.queryTop = vm.queryTop - 1;
    }
  }
  $scope.nextTop = function (array) {
    if ((vm.queryTop + 1) === array.length) {
      vm.queryTop = 0;
    } else {
      vm.queryTop = vm.queryTop+1;
    }
  }
  $scope.lastBot = function (array) {
    if (vm.queryBot === 0 ) {
      vm.queryBot = array.length - 1;
    } else {
      vm.queryBot = vm.queryBot - 1;
    }
  }
  $scope.nextBot = function (array) {
    if ((vm.queryBot + 1) === array.length) {
      vm.queryBot = 0;
    } else {
      vm.queryBot = vm.queryBot+1;
    }
  }

  vm.newComb = function () {
    var json ={
      combinations: 'test',
    }
    var newComb = $http.post('/combinations/new', json);
    newComb.then(function (response) {
      getCombinations();
    })
  }
  vm.getCollectionsOf = function (sort) {
    var collections = collectionsService.getCollections(sort);
    collections.then(function (res) {
      if (sort === 'top') {
        vm.top = res.data;
        console.log(vm.top);
      }
      if (sort === 'bot') {
        vm.bot = res.data;
      }
      if (sort === 'foot') {
        vm.foot = res.data;
      }
      if (sort === 'fullbody') {
        vm.fullbody = res.data;
      }
    })
  }
  function getCombinations() {
    var getComb = $http.get('/combinations');
    getComb.then(function (res) {
      vm.combs = res.data;
    })
  }
  function activate() {
    getCombinations();
    vm.getCollectionsOf('top');
    vm.getCollectionsOf('bot');
    vm.getCollectionsOf('foot');
    vm.getCollectionsOf('fullbody');
  }
  activate();

}


app.directive('maker', function () {
  return {
    templateUrl: 'combinations/maker.html'
  }
})

// app.directive('draggable', ['$document' , function($document) {
//     return {
//       restrict: 'A',
//       link: function(scope, elm, attrs) {
//         var startX, startY, initialMouseX, initialMouseY;
//         elm.css({position: 'absolute'});
//
//         elm.bind('mousedown', function($event) {
//           startX = elm.prop('offsetLeft');
//           startY = elm.prop('offsetTop');
//           initialMouseX = $event.clientX;
//           initialMouseY = $event.clientY;
//           $document.bind('mousemove', mousemove);
//           $document.bind('mouseup', mouseup);
//           return false;
//         });
//
//         function mousemove($event) {
//           var dx = $event.clientX - initialMouseX;
//           var dy = $event.clientY - initialMouseY;
//           elm.css({
//             top:  startY + dy + 'px',
//             left: startX + dx + 'px'
//           });
//           return false;
//         }
//
//         function mouseup() {
//           $document.unbind('mousemove', mousemove);
//           $document.unbind('mouseup', mouseup);
//         }
//       }
//     };
//   }]);
//
// app.directive('ngDraggable', function($document) {
//   return {
//     restrict: 'A',
//     scope: {
//       dragOptions: '=ngDraggable'
//     },
//     link: function(scope, elem, attr) {
//       var startX, startY, x = 0, y = 0,
//           start, stop, drag, container;
//
//       var width  = elem[0].offsetWidth,
//           height = elem[0].offsetHeight;
//
//       // Obtain drag options
//       if (scope.dragOptions) {
//         start  = scope.dragOptions.start;
//         drag   = scope.dragOptions.drag;
//         stop   = scope.dragOptions.stop;
//         var id = scope.dragOptions.container;
//         if (id) {
//           container = document.getElementById(id).getBoundingClientRect();
//         }
//       }
//
//       // Bind mousedown event
//       elem.on('mousedown', function(e) {
//         e.preventDefault();
//         startX = e.clientX - elem[0].offsetLeft;
//         startY = e.clientY - elem[0].offsetTop;
//         $document.on('mousemove', mousemove);
//         $document.on('mouseup', mouseup);
//         if (start) start(e);
//       });
//
//       // Handle drag event
//       function mousemove(e) {
//         y = e.clientY - startY;
//         x = e.clientX - startX;
//         setPosition();
//         if (drag) drag(e);
//       }
//
//       // Unbind drag events
//       function mouseup(e) {
//         $document.unbind('mousemove', mousemove);
//         $document.unbind('mouseup', mouseup);
//         if (stop) stop(e);
//       }
//
//       // Move element, within container if provided
//       function setPosition() {
//         if (container) {
//           if (x < container.left) {
//             x = container.left;
//           } else if (x > container.right - width) {
//             x = container.right - width;
//           }
//           if (y < container.top) {
//             y = container.top;
//           } else if (y > container.bottom - height) {
//             y = container.bottom - height;
//           }
//         }
//
//         elem.css({
//           top: y + 'px',
//           left:  x + 'px'
//         });
//       }
//     }
//   }
// })
