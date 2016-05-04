var app = angular.module('trand');
app.controller('combinationsController', combinations);
app.$inject = ['$http', '$scope', '$location', 'userService', '$sce', 'collectionsService', '$timeout', 'awsService'];

function combinations($http, $scope, $location, userService, $sce, $rootScope, collectionsService, $timeout, awsService) {
  var vm = this;
  $scope._ = _;
  $scope.author = 'John Huang';
  $scope.title = 'Summer Time';
  if ($rootScope.currentCombination.title) {
    $scope.author = $rootScope.currentCombination.author;
    $scope.title = $rootScope.currentCombination.title;
    $scope.eventType = $rootScope.currentCombination.eventType;
    $scope.descrition = $rootScope.currentCombination.descrition;
  }
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
        var src = theOne.getAttribute('src');
        json.push({name: bodyParts[i], src: src});
      }
      console.log(json);
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
          console.log(res.status);
          console.log(res.data);
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
        if (response.status == '201') {
          $rootScope.currentCombination._id = response.data;
        }
        resolve();
      })
    });

    Promise.all([pSaveImgsToTmp, pSaveFilesToDB]).then(function(values) {
      $timeout(function () {
        vm.saveResult = true;
        drawAndUpload($rootScope.newImgUrls);
        $scope.saveMsg = 'Saved successfully!';
        $timeout(function () {
          var rmTmp = awsService.removeUserTmp();
          rmTmp.then(function () {
            console.log('User tmp dir is removed.');
          })
        }, 1000);
      }, 2500);
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
    canvasThumb.width = canvasTest.width/6;
    canvasThumb.height = canvasTest.height/6;
    canvasThumb.setAttribute('style', 'border: 1px solid black;');

    for (var i = 0; i < newImages.length; i++) {
      var pos = $("#combox-" + newImages[i].name + "-draggable").position();
      var originImg = document.getElementById('combox-' + newImages[i].name + '-img');
      var newImg = document.getElementById('newImg-'+$rootScope.newImgUrls[i].name);

      var posLeft = pos.left;
      var posTop = pos.top;
      var width = originImg.clientWidth;
      var height = originImg.clientHeight;

      var posLeftThumb = pos.left/6;
      var posTopThumb = pos.top/6;
      var widthThumb = originImg.clientWidth/6;
      var heightThumb = originImg.clientHeight/6;

      context.drawImage(newImg, posLeft, posTop, width, height);
      contextThumb.drawImage(newImg, posLeftThumb, posTopThumb, widthThumb, heightThumb);
    }
    $("#img-out").append(canvasThumb);
    for (var i = 0; i < $rootScope.newImgUrls.length; i++) {
      $("#newImg-"+$rootScope.newImgUrls[i].name).remove();
    }
    $("#tmp-save" ).remove();
    vm.downloadUrl = canvasTest.toDataURL();


    var fileName = $scope.author + '-' + $scope.title + '.png';
    fileName = fileName.toLowerCase().replace(/ /g, '-');
    console.log(fileName);

    vm.downloadName = fileName;
    canvasThumb.toBlob(function(blob) {
      var json = {
        file_name: 'thumb-' + fileName,
        file_type: blob.type,
      }
      var getSignEdRequest = $http.post('/aws/sign_s3', json);
      getSignEdRequest.then(function(res) {
        upload_file(blob, res.data.signed_request, res.data.url)
        vm.linkThumb = res.data.url;
      })
    });
    canvasTest.toBlob(function(blob) {
      var json = {
        file_name: fileName,
        file_type: blob.type,
      }
      var getSignEdRequest = $http.post('/aws/sign_s3', json);
      getSignEdRequest.then(function(res) {
        upload_file(blob, res.data.signed_request);
        vm.linkLarge = res.data.url;
      })
    });
  }

  function upload_file(file, signed_request){
    var upload = $http({
      method: 'PUT',
      url: signed_request,
      data: file,
      headers: {
        'x-amz-acl': 'public-read',
        'content-type': 'image/png',
      },
    });
    upload.then(function (res) {
      console.log(res);
    }, function (err) {
      console.log(err);
    })
  }

  vm.savePic = function () {
    html2canvas($("#img-out"), {
      allowTaint: true,
      logging:true,
      onrendered: function(canvas) {
        document.body.appendChild(canvas);
        console.log();
        canvas.toBlob(function(blob) {
          saveAs(blob, "comb-canvas.jpg");
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
      var array = ['top', 'bot', 'fullbody', 'foot', 'eye', 'head', 'neck', 'bags'];
      for (var i = 0; i < array.length; i++) {
        $( "#combox-" + array[i] + "-draggable").draggable({containment: "#combox-wrapper", scroll: false });
        $( "#combox-" + array[i] + "-draggable" ).resizable({containment: "#combox-wrapper", autoHide: true});
      }
      $scope.ready = true;
    }, 2000);
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
