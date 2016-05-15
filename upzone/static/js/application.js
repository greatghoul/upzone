function getImage(items, callback) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    if (/image\/.*/i.test(item.type)) {
      var image = (item instanceof File) ? item : item.getAsFile();
      image.name = image.name || item.type.replace(/image\//i, 'paste.');
      return callback(image);
    }
  }
}

var app = angular.module('UpZoneApp', []);

app.directive('ngPasteImage', function() {
  function link(scope, element, attrs) {
    element.bind('paste', function(event) {
      var items = event.originalEvent.clipboardData.items;
      getImage(items, function(image) {
        scope.image = image;
        scope.$apply(function() {
          scope.$eval(attrs.ngPasteImage);
        });
      });
    });
  }

  return { link: link };
});

app.directive('ngPreview', function() {
  function link(scope, element, attrs) {
    scope.$watch(attrs.ngPreview, function(image) {
      if (image) {
        var url   = URL.createObjectURL(image);
        var img   = new Image();

        img.onload = function() {
          var width  = element.innerWidth();
          var height = element.innerHeight();

          if (this.width > width || this.height > height) {
            element.css('background-size', 'contain');
          } else {
            element.css('background-size', 'auto');
          }

          element.css('background-image', 'url(' + url + ')');
        };

        img.src = url;
      } else {
        element.css('background-image', 'none');
      }
    });
  }

  return { link: link };
});

app.controller("UploadCtrl", function($scope, $http, $timeout) {
  $scope.image = null;
  $scope.message = null;
  $scope.success = false;

  $scope.clickUpload = function() {
    angular.element('#image').trigger('click');
  };

  $scope.upload = function(image) {
    var formData = new FormData();
    formData.append('image', image, image.name);

    var request = $http.post('/upload', formData, {
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined },
      responseType: 'json'
    });

    request.success(function(data, status) {
      $scope.success = data.success;
      $scope.message = data.message;
    });
  };

  $scope.handleKey = function($event) {
    if ($event.keyCode == 27) {
      $scope.image = null;
      $scope.success = null;
      $scope.message = null;
    }
  };

  $('#message').bind('click', function() {
    this.select();
  });

  $('#image').bind('change', function() {
    getImage(this.files, function(image) {
      $scope.image = image;
      $scope.upload(image);
    });
  });

  $scope.$watch('success', function(success) {
    $timeout(function() {
      $('#message').trigger('click');
    }, 100);
  });
});
