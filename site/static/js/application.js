$(function() {
  function uploadFile(file) {
    var formData = new FormData();
    formData.append('image', file, file.name);

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      cache: false,
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function(data, textStatus, jqXHR) {
        console.log(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('ERRORS: ' + textStatus, errorThrown);
      }
    });
  }

  function getPastedImage(event, callback) {
    var items = event.originalEvent.clipboardData.items;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      if (/image\/.*/i.test(item.type)) {
        var file = item.getAsFile();
        file.name = item.type.replace(/image\//i, 'paste.');
        return callback(file);
      }
    }

    return null;
  }

  function previewImage(image) {
    $('.container.active').removeClass('active');
    $('.container-preview').addClass('active');

    var $container = $('.container-preview');
    var reader  = new FileReader();

    reader.readAsDataURL(image);
    reader.onload = function (event) {
      var imageObj = new Image();
      
      var url = event.target.result;

      imageObj.onload = function() {
        var width  = $container.innerWidth();
        var height = $container.innerHeight();

        if (this.width > width || this.height > height) {
          $container.css('background-size', 'contain');
        } else {
          $container.css('background-size', 'auto');
        }

        $container.css('background-image', 'url(' + url + ')');
      };

      imageObj.src = url;
    };
  }

  $('body').on('paste', function(event) {
    getPastedImage(event, function(image) {
      previewImage(image);
      // uploadFile(file);
    });
  });
});