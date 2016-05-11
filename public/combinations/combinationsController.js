var app = angular.module('trand');
app.controller('combinationsController', combinations);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService', '$timeout', 'awsService'];

function combinations($http, $scope, $location, userService, $sce, $rootScope, collectionsService, $timeout, awsService) {
  var vm = this;
  vm.saveResult = true;
  $scope._ = _;
  $scope.posX = 0;
  $scope.posY = 0;

  var today = new Date();
  vm.timeNow = today.getTime();

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
    theOne[0].imgUrl = theOne[0].data[theOne[0].index].item.image.sizes.Best.url;
  }

  $scope.next = function (name) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    if ((theOne[0].index + 1) === theOne[0].data.length) {
      theOne[0].index = 0;
    } else {
      theOne[0].index ++ ;
    }
    theOne[0].imgUrl = theOne[0].data[theOne[0].index].item.image.sizes.Best.url;
  }

  $scope.showInBox = function (name) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    theOne[0].show = !theOne[0].show;
  }

  $scope.setPosition = function (name) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    var current = document.getElementById('combox-'+ name + '-draggable');
    theOne[0].position = current.getAttribute('style');
  }

  $scope.select = function (name, index) {
    var theOne = _.where($rootScope.queryLists, {name: name});
    theOne[0].index = index;
    theOne[0].imgUrl = theOne[0].data[theOne[0].index].item.image.sizes.Best.url;
  }

  $scope.save = function () {
    $rootScope.currentCombination.author = $scope.author;
    $rootScope.currentCombination.title = $scope.title;
    $rootScope.currentCombination.eventType = $scope.eventType;
    $rootScope.currentCombination.descrition = $scope.descrition;
  }

  vm.newComb = function () {
    vm.saveResult = false;
    $( "#img-out" ).empty();
    var pSaveImgsToTmp = new Promise(function(resolve, reject) {
      var bodyParts = ['top', 'bot', 'fullbody', 'foot', 'neck', 'head', 'eye', 'bags'];

      var json = [];
      for (var i = 0; i < bodyParts.length; i++) {
        var theOne = document.getElementById('combox-' + bodyParts[i] + '-img');
        if (theOne != null) {
          var src = theOne.getAttribute('src');
        } else {
          var src = 'n/a'
        }
        json.push({name: bodyParts[i], src: src});
      }
      var tmp = awsService.saveInTmp(json);
      tmp.then(function (res) {
        var p1 = new Promise(function(resolve, reject) {
          $rootScope.newImgUrls = res.data;
          var tmp = document.createElement('div');
          tmp.setAttribute('id', 'tmp-save');
          tmp.className = 'hidden';
          document.body.appendChild(tmp);

          for (var i = 0; i < $rootScope.newImgUrls.length; i++) {
            var img = document.createElement('img');
            img.src = $rootScope.newImgUrls[i].src;
            img.setAttribute('id', 'newImg-'+$rootScope.newImgUrls[i].name);
            tmp.appendChild(img);
          }

          resolve();
        });
        p1.then(function(){
          resolve();
        })
      });
    });

    var pSaveFilesToDB = new Promise(function(resolve, reject) {
      $scope.thumbShow = 'save';
      $scope.saveMsg = 'Saving...';
      var rootArray = $rootScope.queryLists;
      var saveComb = [];
      for (var i = 0; i < rootArray.length; i++) {
        var theOne = rootArray[i].data[rootArray[i].index];
        var object = {
          imgUrl: rootArray[i].imgUrl,
          index: rootArray[i].index,
          name: rootArray[i].name,
          order: rootArray[i].order,
          position: rootArray[i].position,
          show: rootArray[i].show,
          item: {},
        }
        saveComb.push(object);
        saveComb[i].item.id = theOne.item.id;
        saveComb[i].item.clickUrl = theOne.item.clickUrl;
        saveComb[i].item.name = theOne.item.name;
        if (theOne.item.brand) {
          saveComb[i].item.brandName = theOne.item.brand.name;
        }
        saveComb[i].item.price = theOne.item.price;
        saveComb[i].item.retailerName = theOne.item.retailer.name;
        saveComb[i].item.categories = theOne.item.categories;
      }
      var json = {
        information: $rootScope.currentCombination,
        combinations: saveComb,
      }
      var newComb = $http.post('/combinations/new', json);
      newComb.then(function (response) {
        console.log(response.data);
        if (response.status == '201') {
          $rootScope.currentCombination._id = response.data;
        }
        vm.directlink = $location.absUrl().replace(/combinations/, 'ideas') + '/' + response.data;
        resolve();
      })
    });

    Promise.all([pSaveImgsToTmp, pSaveFilesToDB]).then(function(values) {
      $scope.saveMsg = 'Generating Thumbs...';
      $timeout(function () {
        $scope.saveMsg = 'Saved successfully!';
        $timeout(function () {
          $scope.saveMsg = 'Generating Links...';
          drawAndUpload($rootScope.newImgUrls);
          $timeout(function () {
            $scope.saveMsg = 'Thanks for sharing!';
            vm.saveResult = true;
            var rmTmp = awsService.removeUserTmp();
            rmTmp.then(function () {
            })
          }, 1000);
        }, 3000);
      }, 2500);
    })
  }

  vm.getCollectionsOf = function (sort, index) {
    var collections = collectionsService.getCollections(sort);
    collections.then(function (res) {
      if (res.data.length>0) {
        var added = _.where($rootScope.queryLists, {name: sort});
        if (added.length == 0) {
          var object = {
            order: index,
            name: sort,
            data: res.data,
            index: 0,
            show: true,
            imgUrl: res.data[0].item.image.sizes.Best.url,
          }
          if (sort === 'top') {
            object.position = 'left: 280px; top: 40px;';
          }
          if (sort === 'bot') {
            object.position = 'left: 280px; bottom: 40px';
          }
          if (sort === 'fullbody') {
            object.show = false;
            object.position = 'right: 80px; top: 40px;'
          }
          if (sort === 'foot') {
            object.position = 'right: 80px; bottom: 40px;';
          }
          if (sort === 'head') {
            object.show = false;
            object.position = 'left: 40px; top: 40px;';
          }
          if (sort === 'eye') {
            object.position = 'left: 40px; top: 200px;';
          }
          if (sort === 'neck') {
            object.show = false;
            object.position = 'left:40px; top:300px;'
          }
          if (sort === 'bags') {
            object.position = 'left: 40px; bottom: 40px;';
          }
          $rootScope.queryLists.push(object);
        }
        if (added.length > 0) {
          added[0].data = res.data;
        }
      }
    })
  }

  function drawAndUpload(newImages) {
    var canvasTest = document.createElement('canvas');
    canvasTest.setAttribute('id', 'canvasTest');
    var context = canvasTest.getContext('2d');
    canvasTest.width = 700;
    canvasTest.height = 800;
    canvasTest.setAttribute('style', 'border: 1px solid black;');

    var canvasThumb = document.createElement('canvas');
    canvasThumb.setAttribute('id', 'canvasThumb');
    var contextThumb = canvasThumb.getContext('2d');
    canvasThumb.width = canvasTest.width/4;
    canvasThumb.height = canvasTest.height/4;
    canvasThumb.setAttribute('style', 'border: 1px solid black;');

    for (var i = 0; i < newImages.length; i++) {
      var originImg = document.getElementById('combox-' + newImages[i].name + '-img');
      if (originImg != null) {
        var pos = $("#combox-" + newImages[i].name + "-draggable").position();
        var newImg = document.getElementById('newImg-'+$rootScope.newImgUrls[i].name);

        var posLeft = pos.left;
        var posTop = pos.top;
        var width = originImg.clientWidth;
        var height = originImg.clientHeight;

        var posLeftThumb = pos.left/4;
        var posTopThumb = pos.top/4;
        var widthThumb = originImg.clientWidth/4;
        var heightThumb = originImg.clientHeight/4;

        context.drawImage(newImg, posLeft, posTop, width, height);
        contextThumb.drawImage(newImg, posLeftThumb, posTopThumb, widthThumb, heightThumb);
      }
    }
    $("#img-out").append(canvasThumb);
    for (var i = 0; i < $rootScope.newImgUrls.length; i++) {
      $("#newImg-"+$rootScope.newImgUrls[i].name).remove();
    }
    $("#tmp-save" ).remove();
    vm.downloadUrl = canvasTest.toDataURL();

    var fileName = $rootScope.currentCombination._id + '.png';

    vm.downloadName = fileName;
    canvasThumb.toBlob(function(blob) {
      var json = {
        file_name: 'thumb-' + fileName,
        file_type: blob.type,
        dir_name: 'ideas',
      }
      var getSignEdRequest = awsService.signIn(json);
      getSignEdRequest.then(function(res) {
        awsService.upload(blob, res.data.signed_request, blob.type);
        vm.linkThumb = res.data.url;
        updateImgUrl('thumb', res.data.url);
      })
    });
    canvasTest.toBlob(function(blob) {
      var json = {
        file_name: fileName,
        file_type: blob.type,
        dir_name: 'ideas',
      }
      var getSignEdRequest = awsService.signIn(json);
      getSignEdRequest.then(function(res) {
        awsService.upload(blob, res.data.signed_request, blob.type);
        vm.linkLarge = res.data.url;
        updateImgUrl('large', res.data.url);
      })
    });
  }

  function updateImgUrl(type, url) {
    var json = {
      type: type,
      _id: $rootScope.currentCombination._id,
      largeUrl: url,
      thumbUrl: url,
    }
    var update = $http.post('/combinations/update-img', json);
    update.then(function () {
    })
  }

  vm.savePic = function () {
    html2canvas($("#img-out"), {
      allowTaint: true,
      logging:true,
      onrendered: function(canvas) {
        document.body.appendChild(canvas);
        canvas.toBlob(function(blob) {
          saveAs(blob, "comb-canvas.jpg");
        });
      }
    });
  }

  vm.getCombinations = function () {
    var getComb = $http.get('/combinations');
    getComb.then(function (res) {
      vm.combs = res.data;
    })
  }

  vm.newMaker = function () {
    refresh();
    $scope.maker = true;
    $scope.ready = false;
    var p1 = new Promise(function(resolve, reject) {
      var bodyParts = ['top', 'bot', 'fullbody', 'foot',
                   'neck', 'head', 'eye', 'bags'];
      for (var i = 0; i < bodyParts.length; i++) {
        vm.getCollectionsOf(bodyParts[i], i);
      }
      $scope.posX = 0;
      $scope.posY = 0;

      $scope.$broadcast('content.changed');
      $scope.$broadcast('content.reload');

      resolve();
    });
    p1.then(function () {
      $timeout(function(){
        var array = ['top', 'bot', 'fullbody', 'foot', 'eye', 'head', 'neck', 'bags'];
        for (var i = 0; i < array.length; i++) {
          $( "#combox-" + array[i] + "-draggable").draggable({containment: "#combox-wrapper", scroll: false });
          $( "#combox-" + array[i] + "-draggable" ).resizable({containment: "#combox-wrapper", autoHide: true});
        }
        $scope.ready = true;
      }, 5000);
    })
  }

  vm.edit = function (item) {
    $rootScope.queryLists = [];
    $rootScope.currentCombination = {};
    $scope.maker = true;
    $scope.ready = false;
    $rootScope.queryLists = item.combinations
    $scope.author = item.information.author;
    $scope.title = item.information.title;
    $rootScope.currentCombination = {
      author: item.information.author,
      title: item.information.title,
      _id: item._id,
    }

    var p1 = new Promise(function(resolve, reject) {
      var bodyParts = ['top', 'bot', 'fullbody', 'foot',
                   'neck', 'head', 'eye', 'bags'];
      for (var i = 0; i < bodyParts.length; i++) {
        vm.getCollectionsOf(bodyParts[i], i);
      }
      $scope.posX = 0;
      $scope.posY = 0;

      $scope.$broadcast('content.changed');
      $scope.$broadcast('content.reload');

      resolve();
    });
    p1.then(function () {
      $timeout(function(){
        var array = ['top', 'bot', 'fullbody', 'foot', 'eye', 'head', 'neck', 'bags'];
        for (var i = 0; i < array.length; i++) {
          $( "#combox-" + array[i] + "-draggable").draggable({containment: "#combox-wrapper", scroll: false });
          $( "#combox-" + array[i] + "-draggable" ).resizable({containment: "#combox-wrapper", autoHide: true});
        }
        $scope.ready = true;
      }, 5000);
    })
  }

  vm.delete = function (item) {
    var del = $http({
      method: 'DELETE',
      url: '/combinations/remove/' + item._id,
    });
    del.then(function (res) {
      vm.getCombinations();
    });
  }

  vm.refresh = function () {
    var array = ['top', 'bot', 'fullbody', 'foot', 'eye', 'head', 'neck', 'bags'];
    for (var i = 0; i < array.length; i++) {
      $( "#combox-" + array[i] + "-draggable").draggable({containment: "#combox-wrapper", scroll: false });
      $( "#combox-" + array[i] + "-draggable" ).resizable({containment: "#combox-wrapper", autoHide: true});
    }
    $scope.ready = true;
  }

  function refresh() {
    $scope.author = 'Anonymous';
    $scope.title = 'Untitled';
    $rootScope.currentCombination.author = $scope.author;
    $rootScope.currentCombination.title = $scope.title;
    delete $rootScope.currentCombination._id;
    $rootScope.queryLists = [];
  }

  function activate() {
    vm.getCombinations();
  }

  activate();
}
app.directive('myCombs', function () {
  return {
    templateUrl: 'combinations/myCombs.html'
  }
})
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
